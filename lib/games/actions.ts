"use server"

import { db, games } from "@/db"
import { auth } from "@clerk/nextjs/server"
import { refresh } from "next/cache"

const TITLE_MAX_LENGTH = 80

export const createGame = async (formData: FormData) => {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("An active organization is required to create a game.")
  }
  const prompt = formData.get("prompt")
  const title = typeof prompt === "string" ? prompt.trim() : ""

  if (!title) {
    return
  }

  await db
    .insert(games)
    .values({
      orgId,
      title:
        title.length > TITLE_MAX_LENGTH
          ? `${title.slice(0, TITLE_MAX_LENGTH - 1).trimEnd()}...`
          : title,
    })
    .returning()

    refresh()
}
