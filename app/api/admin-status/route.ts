import { NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

/** Proxy till Convex adminStatus (används av äldre klientkod). */
export async function GET() {
  try {
    const status = await fetchQuery(api.adminStatus.getAdminStatus, {});
    return NextResponse.json({ isOnline: status.isOnline });
  } catch {
    return NextResponse.json({ isOnline: false });
  }
}

export async function POST() {
  return NextResponse.json({ success: true });
}
