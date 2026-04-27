import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/Header"
import { ArtistList } from "@/components/ArtistList"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/")

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName={session.user?.name} />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
        <ArtistList />
      </main>
    </div>
  )
}
