import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const rows = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // 1) Ensure a demo org & project exist
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

  // Ensure a demo service row for relation
  const svc = await prisma.service.upsert({
    where: { id: "orders-api" },
    update: {},
    create: { id: "orders-api", name: "orders-api", type: "api", projectId: project.id },
  });

  // 2) Create the campaign
  const c = await prisma.campaign.create({
    data: {
      projectId: project.id,
      module: body.module ?? "api",
      env: body.env ?? "staging",
      safe: body.safe ?? true,
      rate: Number(body.rate ?? 10),
      notes: body.notes ?? "",
      status: "completed", // for MVP we mark it done immediately
    },
  });

  // 3) Create a sample finding tied to that campaign
  await prisma.finding.create({
    data: {
      id: `F-${Math.floor(1000 + Math.random() * 9000)}`,
      title: "BOLA: IDOR on /v1/orders/{id}",
      severity: "Critical",
      module: "API & GraphQL Pentest",
      service: "orders-api",
      status: "Validated",
      time: new Date(),
      campaignId: c.id,
      serviceId: svc.id,
    },
  });

  return NextResponse.json(c, { status: 201 });
}
