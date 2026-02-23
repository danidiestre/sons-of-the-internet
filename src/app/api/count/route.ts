import { NextResponse } from "next/server";

const NOTION_API_URL =
  "https://notion-integration-pi.vercel.app/api/count";

export async function GET() {
  try {
    const res = await fetch(NOTION_API_URL, { next: { revalidate: 60 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ total: 0, by_event: {} }, { status: 502 });
  }
}
