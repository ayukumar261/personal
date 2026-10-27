import Markdoc from "@markdoc/markdoc"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import * as React from "react"
import { bundledLanguages, codeToHtml } from "shiki"

import { Container } from "@/components/container"
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
      <article className="mt-[18px] sm:mt-14 lg:mt-20">
        <header className="mb-8 pb-2 sm:mb-10 sm:pb-4">
          <h1 className="text-4xl leading-[1.1] font-normal tracking-tight text-pretty sm:text-5xl">
            {post.title}
          </h1>
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
