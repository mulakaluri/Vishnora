import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { campaignsQueue } from "@/lib/queue";
import { CampaignStatus } from "@prisma/client";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const job = await campaignsQueue.getJob(id);
    if (job) await job.remove();
  } catch {
    // ignore if not in queue
  }

  await prisma.campaign.update({
    where: { id },
    data: { status: CampaignStatus.failed }, // Use a valid CampaignStatus enum value
  });

  return NextResponse.json({ ok: true });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(campaign);
}