import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { fetchAllSavedTracks, fetchArtistImages, fetchFollowedArtistIds } from "@/lib/spotify"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const artistMap = await fetchAllSavedTracks(session.accessToken)
  const artistIds = [...artistMap.keys()]

  const [images, followedIds] = await Promise.all([
    fetchArtistImages(session.accessToken, artistIds),
    fetchFollowedArtistIds(session.accessToken),
  ])

  const artists = artistIds.map((id) => ({
    id,
    name: artistMap.get(id)!.name,
    songCount: artistMap.get(id)!.count,
    image: images.get(id) ?? null,
    isFollowing: followedIds.has(id),
  }))

  artists.sort((a, b) => b.songCount - a.songCount)

  return NextResponse.json(artists)
}
