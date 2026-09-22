import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import { ChatThread } from "@/features/chat/chat-thread"
import { getGame } from "@/lib/games/queries"

type GamePageProps = {
  params: Promise<{ id: string }>
}

export default async function GamePage({ params }: GamePageProps) {
  await auth.protect({ unauthenticatedUrl: "/sign-in" })

  const { id } = await params

  const game = await getGame(id)

  if (!game) {
    notFound()
  }

  return (
    <ChatThread
      key={game.id}
      gameId={game.id}
      initialMessages={game.messages}
    />
  )
}
