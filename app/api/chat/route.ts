import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { auth } from "@clerk/nextjs/server"
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  validateUIMessages,
  type UIMessage,
} from "ai"

import { getGame, updateGameMessages, generateMessageId } from "@/lib/games/queries"

// Slug must be an ID that exists on https://openrouter.ai/models
const MODEL = "meta-llama/llama-3.3-70b-instruct"

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(req: Request) {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { messages, gameId }: { messages: UIMessage[]; gameId?: string } =
    await req.json()

  if (!gameId) {
    return Response.json({ error: "Missing gameId" }, { status: 400 })
  }

  // One game = one chat, scoped to the authenticated org: reject games that
  // belong to another org.
  const game = await getGame(gameId)

  if (!game) {
    return Response.json({ error: "Game not found" }, { status: 404 })
  }

    // The thread is persisted, so guard the shape of what gets written back.
  const validatedMessages = await validateUIMessages({ messages })

  // Persist the full thread the client sent before streaming, so the user's
  // turn is saved even if the model call fails. The assistant reply is already
  // in the client's thread and lands here on the next turn's save.
  await updateGameMessages(gameId, validatedMessages)

  const result = streamText({
    model: openrouter.chat(MODEL),
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream, originalMessages: validatedMessages, generateMessageId }),
    
  })
}
