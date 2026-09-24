import "server-only"

import { auth } from "@clerk/nextjs/server"

import { and, desc, eq } from "drizzle-orm"

import { db, games } from "@/db"

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
