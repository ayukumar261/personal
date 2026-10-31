import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { notFound } from "next/navigation"
import { ImageResponse } from "next/og"

import { formatAuthors } from "@/lib/authors"
import { getPublishedPost, getPublishedPosts } from "@/lib/keystatic"

export const alt = "Blog post preview"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const newsreader = readFile(
  join(process.cwd(), "assets/fonts/Newsreader-Regular.ttf")
)
const inter = readFile(join(process.cwd(), "assets/fonts/Inter-Regular.ttf"))

export async function generateStaticParams() {
  const posts = await getPublishedPosts()

  return posts.map(({ slug }) => ({ slug }))
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPublishedPost(slug)

  if (!post) {
    notFound()
  }

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "56px 64px",
        background: "#ffffff",
        color: "#171717",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "Inter",
          fontSize: 32,
          color: "#737373",
          paddingBottom: 28,
          borderBottom: "1px solid #dedede",
        }}
      >
        {formatAuthors(post.authors)}
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "flex-end",
          paddingBottom: 24,
          fontFamily: "Newsreader",
          fontSize: post.title.length > 80 ? 68 : 88,
          lineHeight: 1.08,
          letterSpacing: "-2px",
        }}
      >
        {post.title}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Newsreader",
          data: await newsreader,
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: await inter,
          style: "normal",
          weight: 400,
        },
      ],
    }
  )
}
