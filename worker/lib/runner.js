// worker/lib/runner.js

function curlFor(url, headers = {}) {
  const hdrs = Object.entries(headers).map(([k, v]) => `-H '${k}: ${v}'`).join(" ");
  return `curl -i -X GET '${url}' ${hdrs}`.trim();
}

function guessServiceFromPath(p) {
  if (/user|account/i.test(p)) return "accounts-api";
  if (/order|cart/i.test(p)) return "orders-api";
  if (/payment|billing/i.test(p)) return "billing-api";
  return "api";
}

export async function runIdorSimple(targets, cfg = {}) {
  // cfg can later contain tokens or headers
  const findings = [];
  const headers = cfg.headers || {};

  // IDs to try — small set, safe values
  const idA = "123";
  const idB = "456";

  for (const t of targets) {
    if (!t.hasIdParam) continue;

    const urlA = t.url.replace(/\{[^}]*id[^}]*\}/i, idA);
    const urlB = t.url.replace(/\{[^}]*id[^}]*\}/i, idB);

    let resA, resB;
    try {
      resA = await fetch(urlA, { method: "GET", headers });
      resB = await fetch(urlB, { method: "GET", headers });
    } catch (e) {
      // network error — skip this target in v0
      continue;
    }

    const okA = resA.status >= 200 && resA.status < 300;
    const okB = resB.status >= 200 && resB.status < 300;

    if (!okA || !okB) continue;

    // Get bodies (small, truncated)
    const textB = await resB.text().catch(() => "");
    if (!textB || textB.length < 20) continue; // not enough content to be meaningful

    // Heuristic: if both succeed and B returns meaningful content, flag potential IDOR
    const evidence = {
      pocCurl: curlFor(urlB, headers),
      resSample: textB.slice(0, 2048),
      details: {
        path: t.path,
        urlA,
        urlB,
        statusA: resA.status,
        statusB: resB.status,
      },
    };

    findings.push({
      title: `Potential IDOR on ${t.path}`,
      module: "API & GraphQL Pentest",
      service: guessServiceFromPath(t.path),
      severity: "High",
      evidence,
    });
  }

  return findings;
}

export async function runGraphQLPentest(graphqlUrl, targets, cfg = {}) {
  const findings = [];
  const headers = cfg.headers || {};

  for (const query of targets.queries) {
    // Example: try a simple query with fuzzed params
    const body = {
      query: `{ ${query} { __typename } }`
    };
    let res;
    try {
      res = await fetch(graphqlUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(body),
      });
    } catch {
      continue;
    }
    if (res.status >= 200 && res.status < 300) {
      const text = await res.text();
      if (text.length > 20) {
        findings.push({
          title: `GraphQL query accessible: ${query}`,
          module: "API & GraphQL Pentest",
          service: "graphql-api",
          severity: "Medium",
          evidence: {
            pocCurl: `curl -X POST '${graphqlUrl}' -H 'Content-Type: application/json' --data '${JSON.stringify(body)}'`,
            resSample: text.slice(0, 2048),
            details: { query },
          },
        });
      }
    }
  }
  return findings;
}
