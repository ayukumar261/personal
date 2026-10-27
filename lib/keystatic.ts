import "server-only"

import { createReader } from "@keystatic/core/reader"
import { cache } from "react"

import config from "@/keystatic.config"

const reader = createReader(process.cwd(), config)

export const getPublishedPosts = cache(async () => {
  const posts = await reader.collections.posts.all()

  return posts.filter(({ entry }) => !entry.draft)
})

export const getPublishedPost = cache(async (slug: string) => {
  const post = await reader.collections.posts.read(slug)

  if (!post || post.draft) {
    return null
  }

  return post
})
