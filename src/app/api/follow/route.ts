import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id, follow } = await req.json()

  console.log("Token prefix:", session.accessToken.slice(0, 20))
  console.log("Artist ID:", id, "Follow:", follow)

  // Verify the token works at all
  const meRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  })
  const meData = await meRes.json()
  console.log("GET /v1/me status:", meRes.status, "user:", meData.id)

  const res = await fetch(
    `https://api.spotify.com/v1/me/following?type=artist`,
    {
      method: follow ? "PUT" : "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: [id] }),
    }
  )

  if (!res.ok) {
    const body = await res.text()
    console.error(`Spotify follow error ${res.status}:`, body)
    return NextResponse.json({ error: body }, { status: res.status })
  }

  return NextResponse.json({ ok: true })
}
