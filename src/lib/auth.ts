import { AuthOptions } from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { JWT } from "next-auth/jwt"

async function refreshAccessToken(token: JWT): Promise<JWT> {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token.refreshToken ?? "",
    }),
  })

  const refreshed = await response.json()

  if (!response.ok) {
    return { ...token, error: "RefreshAccessTokenError" }
  }

  return {
    ...token,
    accessToken: refreshed.access_token,
    refreshToken: refreshed.refresh_token ?? token.refreshToken,
    expiresAt: Math.floor(Date.now() / 1000) + refreshed.expires_in,
    error: undefined,
  }
}

export const authOptions: AuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "user-library-read user-follow-read user-follow-modify",
          show_dialog: true,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        console.log("Spotify granted scopes:", account.scope)
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
        }
      }
      if (token.expiresAt && Date.now() < token.expiresAt * 1000) {
        return token
      }
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
  },
}
