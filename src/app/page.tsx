import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SignInButton } from "@/components/SignInButton"

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (session) redirect("/dashboard")

  return (
    <main className="flex flex-col items-center justify-center flex-1 min-h-screen">
      <div className="flex flex-col items-center gap-8 text-center px-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold text-white">Follow Artists</h1>
          <p className="text-[#b3b3b3] text-lg max-w-sm">
            See which artists you listen to most and follow them in one click.
          </p>
        </div>
        <SignInButton />
      </div>
    </main>
  )
}
