// src/app/api/ping/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
