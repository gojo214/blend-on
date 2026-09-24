import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { chat, upsertIncomingMessage } from "@trigger.dev/sdk/ai"

import { getGameThread, saveGameThread } from "../lib/games/chat-store"
import { google } from "@ai-sdk/google"

// Slug must be an ID that exists on https://openrouter.ai/models
const MODEL = "meta-llama/llama-3.3-70b-instruct"

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export const gameChat = chat.agent({
  id: "game-chat",

  // The database stays the source of truth for the thread. Load the full
  // history for this game (one game = one chat), grow it with the incoming
  // user message, and persist so the user's turn survives a mid-turn
  // refresh even if the model call fails.
  hydrateMessages: async ({ chatId, trigger, incomingMessages }) => {
    const thread = await getGameThread(chatId)
    const stored = thread?.messages ?? []

    // Pushes a fresh user message; no-ops on tool-approval continuations.
    if (upsertIncomingMessage(stored, { trigger, incomingMessages })) {
      // Preserve the existing session state columns; leave the resume
      // cursor to `onTurnComplete` (this is not a completed turn).
      await saveGameThread(chatId, {
        messages: stored,
        chatAccessToken: thread?.chatAccessToken ?? null,
        lastEventId: thread?.lastEventId ?? null,
      })
    }

    return stored
  },

  // Write the finished turn (thread + session state) in one atomic UPDATE of
  // the games row, so a reload resumes from `lastEventId` without replaying.
  onTurnComplete: async ({ chatId, uiMessages, chatAccessToken, lastEventId }) => {
    await saveGameThread(chatId, {
      messages: uiMessages,
      chatAccessToken: chatAccessToken || null,
      lastEventId: lastEventId ?? null,
    })
  },

  // The exact streamText call the route handler made, unchanged: same model,
  // no system/temperature/stopWhen/provider options, and (as in the route)
  // no tools. `streamText` comes from the run payload so the managed options
  // apply under it; the explicit options above still win.
  run: async ({ messages, signal, streamText }) => {
    return streamText({
      model: google("gemini-3.5-flash"),
      messages,
      abortSignal: signal,
    })
  },
})