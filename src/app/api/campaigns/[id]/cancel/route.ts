import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { campaignsQueue } from "@/lib/queue";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Remove from queue if still queued (BullMQ v4+)
  try {
    // Try to remove by jobId (if you set jobId = campaignId when adding)
    await campaignsQueue.removeJobs(id);
  } catch (e) {
    // ignore if not in queue
  }

  // Update campaign status
  await prisma.campaign.update({
    where: { id },
    data: { status: "canceled" },
  });

  return NextResponse.json({ ok: true });
}