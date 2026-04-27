import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const res = await fetch("https://api.spotify.com/v1/me/tracks?limit=1", {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  })
  const data = await res.json()
  return NextResponse.json({ total: data.total ?? 0 })
}
