// worker/index.js
import "dotenv/config";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { PrismaClient } from "@prisma/client";
import { loadOpenAPI, buildGetTargets } from "./lib/openapi.js";
import { loadGraphQLSchema, buildGraphQLTargets } from "./lib/graphql.js";
import { runIdorSimple, runGraphQLPentest } from "./lib/runner.js";

const prisma = new PrismaClient();

const redis = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: {},
});

console.log("Worker starting…");

new Worker(
  "campaigns",
  async (job) => {
    const { campaignId } = job.data;
    await prisma.campaign.update({ where: { id: campaignId }, data: { status: "running" } });
    const c = await prisma.campaign.findUnique({ where: { id: campaignId } });
    let conf = {};
    try { conf = c?.notes ? JSON.parse(c.notes) : {}; } catch {}

    let findings = [];
    try {
      if (conf.openapiUrl && conf.baseUrl) {
        const doc = await loadOpenAPI(conf.openapiUrl);
        const targets = buildGetTargets(doc, conf.baseUrl);
        const runFindings = await runIdorSimple(targets, conf);
        findings.push(...runFindings);
      }
      if (conf.graphqlUrl && conf.baseUrl) {
        const schema = await loadGraphQLSchema(conf.graphqlUrl);
        const gqlTargets = buildGraphQLTargets(schema);
        const gqlFindings = await runGraphQLPentest(conf.graphqlUrl, gqlTargets, conf);
        findings.push(...gqlFindings);
      }
    } catch (e) {
      console.error("OpenAPI/GraphQL failed:", e.message || e);
    }

    for (const f of findings) {
      const fid = `F-${Math.floor(1000 + Math.random() * 9000)}`;
      await prisma.finding.create({
        data: {
          id: fid,
          title: f.title,
          severity: f.severity,
          module: f.module,
          service: f.service,
          status: "Validated",
          campaignId,
        }
      });
      await prisma.evidence.create({
        data: {
          findingId: fid,
          pocCurl: f.evidence.pocCurl,
          resSample: f.evidence.resSample,
          details: f.evidence.details
        }
      });
    }

    await prisma.campaign.update({ where: { id: campaignId }, data: { status: "completed" } });
  },
  { connection: redis, concurrency: 2 }
)
.on("failed", (job, err) => console.error("Job failed", job?.id, err));
