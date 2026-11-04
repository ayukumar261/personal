import type { Metadata } from "next"
import Image from "next/image"
import NextLink from "next/link"

import prPreview from "@/assets/images/livekit-server-sdk-go-pr-1001.png"
import { Container } from "@/components/container"
import { Footer } from "@/components/footer"
import { Link } from "@/components/ui/link"
import { renderDescription } from "@/lib/description"
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
    <Container className="flex min-h-dvh flex-col">
      <h1 className="mt-[18px] text-2xl font-normal tracking-tight sm:mt-14 lg:mt-20">
        Ayush Kumar
      </h1>
      <div className="typeset typeset-post mt-10 sm:mt-14">
        <p>
          I’m a Software Engineer at <Link href="https://ujet.cx">UJET</Link>, a
          Series D, San Francisco-based startup that builds contact center
          software for some of the world’s largest companies.
        </p>
      </div>
      <section
        aria-label="Writing"
        className="mt-14 flex flex-col gap-12 sm:mt-16"
      >
        <NextLink
          href={`/posts/${CONTRIBUTION_POST}`}
          className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-1 after:ring-foreground/5 after:ring-inset">
            <Image
              src={prPreview}
              alt=""
              sizes="(min-width: 704px) 524px, 86vw"
              placeholder="blur"
              className="absolute top-[10%] left-[7%] h-auto w-[86%] max-w-none rounded-t-[5px] shadow-[0_0_0_1px_rgb(0_0_0/0.04),0_8px_24px_-10px_rgb(0_0_0/0.15)]"
            />
          </div>
          <h2 className="mt-6 text-xl leading-snug text-pretty decoration-foreground/30 underline-offset-4 group-hover:underline">
            {post.title}
          </h2>
          <p className="mt-2 font-link text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
            {renderDescription(post.description)}
          </p>
        </NextLink>
      </section>
      <Footer />
    </Container>
  )
}
