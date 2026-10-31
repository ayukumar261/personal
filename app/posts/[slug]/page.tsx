import Markdoc from "@markdoc/markdoc"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import NextLink from "next/link"
import { notFound } from "next/navigation"
import * as React from "react"
import { bundledLanguages, codeToHtml } from "shiki"

import { Container } from "@/components/container"
import { formatAuthors } from "@/lib/authors"
import { getPublishedPost, getPublishedPosts } from "@/lib/keystatic"
import { markdocConfig } from "@/lib/markdoc"

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

  return {
    title: post.title,
    description: post.description || undefined,
    authors: post.authors.map(({ name, url }) => ({
      name,
      url: url || undefined,
    })),
    alternates: { canonical: `/posts/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description || undefined,
      url: `/posts/${slug}`,
      siteName: "Ayush Kumar",
      locale: "en_US",
      authors: post.authors.map(({ name }) => name),
    },
    twitter: { card: "summary_large_image" },
  }
}

export default async function PostPage({ params }: PostProps) {
  const { slug } = await params
  const post = await getPublishedPost(slug)

  if (!post) {
    notFound()
  }

  const { node } = await post.content()
  const errors = Markdoc.validate(node, markdocConfig)

  if (errors.length) {
    console.error(`Invalid content in post "${slug}":`, errors)
    throw new Error(`Unable to render post "${slug}"`)
  }

  const content = Markdoc.transform(node, markdocConfig)

  return (
    <Container>
      <nav aria-label="Main navigation" className="flex">
        <NextLink
          href="/"
          className="inline-flex items-center gap-2 rounded-sm py-2 font-link text-sm leading-6 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <ArrowLeft
            aria-hidden="true"
            className="size-4 shrink-0"
            strokeWidth={1.5}
          />
          Home
        </NextLink>
      </nav>
      <article className="mt-10 sm:mt-12 lg:mt-14">
        <header className="mb-8 pb-2 sm:mb-10 sm:pb-4">
          <h1 className="text-4xl leading-[1.1] font-normal tracking-tight text-pretty sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-6 font-link text-base text-muted-foreground">
            By {formatAuthors(post.authors)}
          </p>
        </header>
        <div className="typeset typeset-post">
          {Markdoc.renderers.react(content, React, {
            components: { CodeBlock },
          })}
        </div>
      </article>
    </Container>
  )
}

async function CodeBlock({
  code,
  language,
}: {
  code: string
  language?: string
}) {
  const requestedLanguage = language?.toLowerCase() || "text"
  const lang = Object.hasOwn(bundledLanguages, requestedLanguage)
    ? requestedLanguage
    : "text"
  const html = await codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })

  return (
    <div
      className="code-block"
      data-language={lang}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
