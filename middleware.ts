import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip: string = forwarded?.split(",")[0] || "IP not found";

  req.nextUrl.searchParams.set("ip", ip); // Pass IP as query param
  return NextResponse.next();
}
