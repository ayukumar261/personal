import type { Metadata } from "next"
import NextLink from "next/link"

import { Container } from "@/components/container"
import { Link } from "@/components/ui/link"
import { getPublishedPost } from "@/lib/keystatic"

export const metadata: Metadata = { title: "Ayush Kumar" }

const CONTRIBUTION_POST = "improving-dtmf-signaling-in-livekits-go-sdk"

export default async function Page() {
  // Cite the title from the post itself so it always matches exactly.
  const post = await getPublishedPost(CONTRIBUTION_POST)

  if (!post) {
    throw new Error(`Homepage cites unpublished post "${CONTRIBUTION_POST}"`)
  }

  return (
    <Container>
      <h1 className="mt-[18px] text-3xl font-normal tracking-tight sm:mt-14 lg:mt-20">
        Hi! I’m Ayush.
      </h1>
      <div className="typeset typeset-post mt-10 sm:mt-14">
        <p>
          I’m a Software Engineer at <Link href="https://ujet.cx">UJET</Link>, a
          Series D, San Francisco-based startup that builds contact center
          software for some of the world’s largest companies.
        </p>
        <p>
          I recently contributed to{" "}
          <Link href="https://livekit.com">LiveKit</Link>'s Go SDK, and I wrote my
          first blog post about it:{" "}
          <NextLink href={`/posts/${CONTRIBUTION_POST}`}>{post.title}</NextLink>
          .
        </p>
        <p>
          I'm also on {" "}
          <Link
            href="https://github.com/ayukumar261"
            iconClassName="dark:invert"
          >
            GitHub
          </Link>{" "}
          and{" "}
          <Link href="https://www.linkedin.com/in/ayukumar261/">LinkedIn</Link>.
        </p>
      </div>
    </Container>
  )
}
