export interface Artist {
  id: string
  name: string
  image: string | null
  songCount: number
  isFollowing: boolean
}

async function spotifyGet(url: string, accessToken: string) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`Spotify ${res.status}: ${url}`)
  return res.json()
}

export async function fetchAllSavedTracks(
  accessToken: string
): Promise<Map<string, { name: string; count: number }>> {
  const artists = new Map<string, { name: string; count: number }>()
  let url: string | null = "https://api.spotify.com/v1/me/tracks?limit=50"

  while (url) {
    const data = await spotifyGet(url, accessToken)
    for (const item of data.items) {
      if (!item.track) continue
      for (const artist of item.track.artists) {
        const existing = artists.get(artist.id)
        if (existing) {
          existing.count++
        } else {
          artists.set(artist.id, { name: artist.name, count: 1 })
        }
      }
    }
    url = data.next
  }

  return artists
}

export async function fetchArtistImages(
  accessToken: string,
  ids: string[]
): Promise<Map<string, string | null>> {
  const result = new Map<string, string | null>()

  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50)
    try {
      const data = await spotifyGet(
        `https://api.spotify.com/v1/artists?ids=${batch.join(",")}`,
        accessToken
      )
      for (const artist of data.artists ?? []) {
        // index 2 is ~64px thumbnail; fall back to largest if unavailable
        const img = artist.images?.[2]?.url ?? artist.images?.[0]?.url ?? null
        result.set(artist.id, img)
      }
    } catch {
      batch.forEach((id) => result.set(id, null))
    }
  }

  return result
}

export async function checkFollowing(
  accessToken: string,
  ids: string[]
): Promise<Map<string, boolean>> {
  const result = new Map<string, boolean>()

  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50)
    try {
      const data: boolean[] = await spotifyGet(
        `https://api.spotify.com/v1/me/following/contains?type=artist&ids=${batch.join(",")}`,
        accessToken
      )
      batch.forEach((id, idx) => result.set(id, data[idx]))
    } catch {
      batch.forEach((id) => result.set(id, false))
    }
  }

  return result
}
