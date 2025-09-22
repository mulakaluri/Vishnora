import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const rows = await prisma.finding.findMany({
    orderBy: { time: "desc" },
    take: 50,
  });
  return NextResponse.json(rows);
}
