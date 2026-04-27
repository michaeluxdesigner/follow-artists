"use client"

import { signOut } from "next-auth/react"

export function Header({ userName }: { userName?: string | null }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
      <h1 className="text-white font-bold text-lg tracking-tight">Follow Artists</h1>
      <div className="flex items-center gap-4">
        {userName && (
          <span className="text-[#b3b3b3] text-sm hidden sm:block">{userName}</span>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
