import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { campaignsQueue } from "@/lib/queue"; // keep if you're queuing jobs

export async function GET() {
  const rows = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // 1) Ensure org + project exist (MVP-safe)
  const org = await prisma.organization.upsert({
    where: { id: "demo-org" },
    update: {},
    create: { id: "demo-org", name: "Demo Org" },
  });

  const project = await prisma.project.upsert({
    where: { id: "demo-project" },
    update: {},
    create: { id: "demo-project", name: "Demo Project", orgId: org.id },
  });

  // 2) ⬇️ Your snippet goes right here
  const conf = {
    baseUrl: body.baseUrl || "",
    openapiUrl: body.openapiUrl || "",
    safe: !!body.safe,
    rate: Number(body.rate || 10),
  };

  const campaign = await prisma.campaign.create({
    data: {
      projectId: project.id,
      module: body.module ?? "api",
      env: body.env ?? "staging",
      safe: body.safe ?? true,
      rate: conf.rate,
      notes: JSON.stringify(conf),   // important: stores config for the worker
      status: "queued",
    },
  });

  // 3) Optional (if using the worker): enqueue the job
  await campaignsQueue.add("run", { campaignId: campaign.id });

  return NextResponse.json(campaign, { status: 201 });
}
