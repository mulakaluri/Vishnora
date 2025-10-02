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

// Remove the GET handler if you don't need it.
// If you do need it, implement it fully like this:
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(campaign);
}