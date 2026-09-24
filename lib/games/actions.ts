"use server"

import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { auth as clerkAuth } from "@clerk/nextjs/server"
import { auth as triggerAuth } from "@trigger.dev/sdk"
import { chat, type ChatStartSessionParams } from "@trigger.dev/sdk/ai"
import { generateText } from "ai"
import { refresh } from "next/cache"
import { google } from '@ai-sdk/google'
import { db, games } from "@/db"
import { getGame } from "@/lib/games/queries"

import type { gameChat } from "@/trigger/chat"

const TITLE_MAX_LENGTH = 80

// Fast + cheap model for title generation. Must be an ID that exists on
// https://openrouter.ai/models
const TITLE_MODEL = "deepseek/deepseek-chat"

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

const truncate = (value: string) =>
  value.length > TITLE_MAX_LENGTH
    ? `${value.slice(0, TITLE_MAX_LENGTH - 1).trimEnd()}...`
    : value

const generateTitle = async (description: string): Promise<string> => {
  try {
    const { text } = await generateText({
      model: google("gemini-3.5-flash"),
      instructions:
        "You create short titles for player-made games. Respond with only the title — no quotes, no explanation, no trailing punctuation.",
      prompt: `Create a short title (at most ${TITLE_MAX_LENGTH} characters) for this game: ${description}`,
      maxOutputTokens: 50,
      temperature: 0.7,
    })

    const title = text
      .trim()
      .replace(/^["']+|["']+$/g, "")
      .trim()

    if (title) {
      return truncate(title)
    }
  } catch (error) {
    // Fall back to the description so game creation still succeeds.
    console.error(
      "Title generation failed, falling back to description:",
      error
    )
  }

  return truncate(description)
}

export const createGame = async (prompt: string) => {
  const { orgId } = await clerkAuth()

  if (!orgId) {
    throw new Error("An active organization is required to create a game.")
  }

  const description = typeof prompt === "string" ? prompt.trim() : ""

  if (!description) {
    return
  }

  const title = await generateTitle(description)

  await db.insert(games).values({ orgId, title }).returning()

  refresh()
}

const startChatSessionAction = chat.createStartSessionAction<typeof gameChat>(
  "game-chat"
)

/**
 * Creates (or resumes) the chat session for a game and returns the
 * session-scoped PAT the browser uses. Idempotent on (environment, chatId).
 *
 * Carries the route handler's auth check: signed-in, in an org, and the
 * game must belong to that org.
 */
export const startChatSession = async (
  params: ChatStartSessionParams<typeof gameChat>
) => {
  const { userId, orgId } = await clerkAuth()

  if (!userId || !orgId) {
    throw new Error("Unauthorized")
  }

  const game = await getGame(params.chatId)

  if (!game) {
    throw new Error("Game not found")
  }

  return startChatSessionAction(params)
}

/**
 * Mints a fresh session-scoped PAT for an existing game (the transport calls
 * this on a 401/403 to refresh). Same auth check as `startChatSession`.
 */
export const mintChatAccessToken = async (chatId: string) => {
  const { userId, orgId } = await clerkAuth()

  if (!userId || !orgId) {
    throw new Error("Unauthorized")
  }

  const game = await getGame(chatId)

  if (!game) {
    throw new Error("Game not found")
  }

  return triggerAuth.createPublicToken({
    scopes: {
      read: { sessions: chatId },
      write: { sessions: chatId },
    },
    expirationTime: "1h",
  })
}
