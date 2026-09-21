import "server-only"

import { auth } from "@clerk/nextjs/server"

import { desc, eq } from "drizzle-orm"

import { db, games, type Game } from "@/db"

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
