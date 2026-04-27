import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id, follow } = await req.json()

  const res = await fetch(
    `https://api.spotify.com/v1/me/following?type=artist&ids=${id}`,
    {
      method: follow ? "PUT" : "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    }
  )

  if (!res.ok) {
    const body = await res.text()
    console.error(`Spotify follow error ${res.status}:`, body)
    return NextResponse.json({ error: body }, { status: res.status })
  }

  return NextResponse.json({ ok: true })
}
