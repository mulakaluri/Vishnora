import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { Campaign } from "@/lib/types";
import { runSimulation } from "@/lib/simulators";

export async function GET() {
  return NextResponse.json(store.listCampaigns());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = `C-${Math.floor(1000 + Math.random() * 9000)}`;
  const c: Campaign = {
    id,
    module: body.module || "api",
    env: body.env || "staging",
    safe: body.safe ?? true,
    rate: Number(body.rate) || 10,
    notes: body.notes || "",
    status: "completed", // for demo we mark completed instantly
    createdAt: new Date().toISOString(),
  };

  store.addCampaign(c);
  runSimulation(c); // create a demo finding immediately
  return NextResponse.json(c, { status: 201 });
}
