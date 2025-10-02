// worker/lib/openapi.js
import yaml from "yaml";

// Uses Node 18+ global fetch (no node-fetch needed)
export async function loadOpenAPI(openapiUrl) {
  const res = await fetch(openapiUrl, { method: "GET", timeout: 15000 });
  if (!res.ok) throw new Error(`OpenAPI fetch failed: ${res.status}`);
  const text = await res.text();
  // detect YAML vs JSON by extension or first char
  const isYaml = /\.ya?ml$/i.test(openapiUrl) || (!text.trim().startsWith("{"));
  return isYaml ? yaml.parse(text) : JSON.parse(text);
}

export function buildGetTargets(doc, baseUrl) {
  const out = [];
  const paths = doc?.paths ?? {};
  for (const [path, ops] of Object.entries(paths)) {
    if (!ops?.get) continue;

    // safety: skip obviously destructive / auth endpoints
    if (/(delete|admin|token|auth|login|logout)/i.test(path)) continue;

    const hasIdParam = /\{[^}]*id[^}]*\}/i.test(path);
    const url = baseUrl.replace(/\/+$/, "") + path;
    out.push({ method: "GET", url, path, hasIdParam });
  }
  return out;
}
