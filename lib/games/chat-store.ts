import { eq } from "drizzle-orm"
import type { UIMessage } from "ai"

import { db, games } from "../../db"

/**
 * Everything the chat transport needs per game, read back on page load so a
 * fresh tab can reconnect: the persisted thread, the session-scoped PAT, and
 * the stream resume cursor.
 *
 * One game = one chat (`game.id` is the transport's `chatId`), so all three
 * live on the same `games` row and are written by a single UPDATE — messages
 * and `lastEventId` can never drift apart.
 */
export type GameThreadSession = {
  messages: UIMessage[]
  chatAccessToken: string | null
  lastEventId: string | null
}

export const getGameThread = async (
  chatId: string
): Promise<GameThreadSession | null> => {
  const [game] = await db
    .select({
      messages: games.messages,
      chatAccessToken: games.chatAccessToken,
      lastEventId: games.lastEventId,
    })
    .from(games)
    .where(eq(games.id, chatId))
    .limit(1)

  return game ?? null
}

export const saveGameThread = async (
  chatId: string,
  { messages, chatAccessToken, lastEventId }: GameThreadSession
) => {
  await db
    .update(games)
    .set({ messages, chatAccessToken, lastEventId })
    .where(eq(games.id, chatId))
}