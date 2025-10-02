import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { campaignsQueue } from "@/lib/queue";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  // Remove from queue if still queued (BullMQ v4+)
  try {
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