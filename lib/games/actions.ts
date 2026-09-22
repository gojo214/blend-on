"use server"

import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { auth } from "@clerk/nextjs/server"
import { generateText } from "ai"
import { refresh } from "next/cache"

import { db, games } from "@/db"

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
      model: openrouter.chat(TITLE_MODEL),
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
  const { orgId } = await auth()

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
