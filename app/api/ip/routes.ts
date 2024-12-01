import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip: string = forwarded?.split(",")[0] || "IP not found";

  return NextResponse.json({ ip });
}
