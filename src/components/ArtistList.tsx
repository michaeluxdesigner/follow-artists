"use client"

import { useEffect, useState } from "react"
import { ArtistCard } from "./ArtistCard"

interface Artist {
  id: string
  name: string
  image: string | null
  songCount: number
  isFollowing: boolean
}

export function ArtistList() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch total count and full artist list simultaneously
    fetch("/api/artists/count")
      .then((r) => r.json())
      .then((data) => setTotal(data.total))
      .catch(() => {})

    fetch("/api/artists")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch")
        return r.json()
      })
      .then((data) => {
        setArtists(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Something went wrong loading your library. Please refresh.")
        setLoading(false)
      })
  }, [])

  function handleFollowChange(id: string, following: boolean) {
    setArtists((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isFollowing: following } : a))
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-[#b3b3b3]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#1db954] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">
            {total !== null
              ? `Scanning ${total.toLocaleString()} songs…`
              : "Scanning your Spotify library…"}
          </p>
        </div>
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#1db954] rounded-full animate-[progress_2s_ease-in-out_infinite]" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-24 text-[#b3b3b3]">
        <p>{error}</p>
      </div>
    )
  }

  if (artists.length === 0) {
    return (
      <div className="text-center py-24 text-[#b3b3b3]">
        <p>No saved songs found. Start liking songs on Spotify!</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[#b3b3b3] text-sm mb-4">
        {artists.length} artists in your library
      </p>
      <div className="flex flex-col gap-0.5">
        {artists.map((artist, i) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            rank={i + 1}
            onFollowChange={handleFollowChange}
          />
        ))}
      </div>
    </div>
  )
}
