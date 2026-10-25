import Markdoc from "@markdoc/markdoc"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import * as React from "react"

import {
  formatPublishDate,
  getPublishedPost,
  getPublishedPosts,
} from "@/lib/keystatic"

type PostProps = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getPublishedPosts()

  return posts.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPost(slug)

  if (!post) {
    notFound()
  }

  return { title: post.title, description: post.description || undefined }
}

export default async function PostPage({ params }: PostProps) {
  const { slug } = await params
  const post = await getPublishedPost(slug)

  if (!post) {
    notFound()
  }

  const { node } = await post.content()
  const errors = Markdoc.validate(node)

  if (errors.length) {
    console.error(`Invalid content in post "${slug}":`, errors)
    throw new Error(`Unable to render post "${slug}"`)
  }

  const content = Markdoc.transform(node)

  return (
    <main>
      <Link href="/posts">Back to posts</Link>
      <article>
        <header>
          <time dateTime={post.publishedDate}>
            {formatPublishDate(post.publishedDate)}
          </time>
          <h1>{post.title}</h1>
          {post.description && <p>{post.description}</p>}
        </header>
        {Markdoc.renderers.react(content, React)}
      </article>
    </main>
  )
}
