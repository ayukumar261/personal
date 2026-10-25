import "server-only"

import { createReader } from "@keystatic/core/reader"
import { cache } from "react"

import config from "@/keystatic.config"

const reader = createReader(process.cwd(), config)

export const getPublishedPosts = cache(async () => {
  const posts = await reader.collections.posts.all()

  return posts
    .filter(({ entry }) => !entry.draft)
    .sort((a, b) => b.entry.publishedDate.localeCompare(a.entry.publishedDate))
})

export const getPublishedPost = cache(async (slug: string) => {
  const post = await reader.collections.posts.read(slug)

  return post && !post.draft ? post : null
})

export function formatPublishDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))
}
