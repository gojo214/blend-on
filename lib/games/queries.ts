import "server-only"

import { auth } from "@clerk/nextjs/server"

import { and, desc, eq } from "drizzle-orm"

import { createIdGenerator, type UIMessage } from "ai"

import { db, games, type Game } from "@/db"

export const generateMessageId = createIdGenerator({ prefix: "msg", size: 16 })

export const listGame = async () => {
  const { orgId } = await auth()

  if (!orgId) {
    return []
  }
  const list = await db
    .select()
    .from(games)
    .where(eq(games.orgId, orgId))
    .orderBy(desc(games.createdAt))

  return list
}

export const getGame = async (id: string) => {
  const { orgId } = await auth()

  if (!orgId) {
    return null
  }

  const [game] = await db
    .select()
    .from(games)
    .where(and(eq(games.id, id), eq(games.orgId, orgId)))
    .limit(1)

  return game ?? null
}

export const updateGameMessages = async (id: string, messages: UIMessage[]) => {
  const { orgId } = await auth()

  if (!orgId) {
    return
  }

  await db
    .update(games)
    .set({ messages })
    .where(and(eq(games.id, id), eq(games.orgId, orgId)))
}
