import type { Metadata } from "next"
import Link from "next/link"

import { formatPublishDate, getPublishedPosts } from "@/lib/keystatic"

export const metadata: Metadata = { title: "Posts" }

export default async function PostsPage() {
  const posts = await getPublishedPosts()

  return (
    <main>
      <Link href="/">Back home</Link>
      <h1>Posts</h1>
      {posts.length ? (
        <ul>
          {posts.map(({ slug, entry }) => (
            <li key={slug}>
              <time dateTime={entry.publishedDate}>
                {formatPublishDate(entry.publishedDate)}
              </time>
              <h2>
                <Link href={`/posts/${slug}`}>{entry.title}</Link>
              </h2>
              {entry.description && <p>{entry.description}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts published yet.</p>
      )}
    </main>
  )
}
