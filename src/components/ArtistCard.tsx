"use client"

import { useState } from "react"
import Image from "next/image"

interface Artist {
  id: string
  name: string
  image: string | null
  songCount: number
  isFollowing: boolean
}

interface Props {
  artist: Artist
  rank: number
  onFollowChange: (id: string, following: boolean) => void
}

export function ArtistCard({ artist, rank, onFollowChange }: Props) {
  const [isFollowing, setIsFollowing] = useState(artist.isFollowing)
  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState(false)

  async function toggleFollow() {
    if (loading) return
    setLoading(true)
    const newFollowing = !isFollowing
    setIsFollowing(newFollowing)

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: artist.id, follow: newFollowing }),
      })
      if (!res.ok) throw new Error()
      onFollowChange(artist.id, newFollowing)
    } catch {
      setIsFollowing(!newFollowing)
    } finally {
      setLoading(false)
    }
  }

  const buttonClass = isFollowing
    ? hovered
      ? "border-red-400 text-red-400"
      : "border-[#b3b3b3] text-white hover:border-white"
    : "bg-[#1db954] border-[#1db954] text-black hover:bg-[#1ed760] hover:border-[#1ed760]"

  return (
    <div className="flex items-center gap-4 px-3 py-2.5 rounded-md hover:bg-white/5 transition-colors">
      <span className="text-[#b3b3b3] text-sm w-6 text-right shrink-0 tabular-nums">
        {rank}
      </span>

      <div className="shrink-0">
        {artist.image ? (
          <Image
            src={artist.image}
            alt={artist.name}
            width={48}
            height={48}
            className="rounded-full object-cover w-12 h-12"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#282828] flex items-center justify-center text-[#b3b3b3] text-lg font-semibold select-none">
            {artist.name[0].toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{artist.name}</p>
        <p className="text-[#b3b3b3] text-sm">
          {artist.songCount} {artist.songCount === 1 ? "song" : "songs"}
        </p>
      </div>

      <button
        onClick={toggleFollow}
        disabled={loading}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${buttonClass}`}
      >
        {isFollowing ? (hovered ? "Unfollow" : "Following") : "Follow"}
      </button>
    </div>
  )
}
