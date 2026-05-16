import { NextResponse } from "next/server";

let adminOnline = false;
let lastSeen = Date.now();

export async function POST(request: Request) {
  try {
    const { isOnline } = await request.json();
    adminOnline = isOnline;
    lastSeen = Date.now();
    console.log("Admin status updated:", isOnline ? "🟢 ONLINE" : "🔴 OFFLINE");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET() {
  const oneMinuteAgo = Date.now() - 60 * 1000; // 1 minut timeout
  const isOnline = adminOnline && lastSeen > oneMinuteAgo;
  return NextResponse.json({ isOnline });
}
