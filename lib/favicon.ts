import "server-only"

import { cache } from "react"

const ONE_WEEK = 60 * 60 * 24 * 7

type LinkTag = Record<string, string>

function attributesOf(tag: string): LinkTag {
  return Object.fromEntries(
    [...tag.matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(
      ([, name, ...values]) => [
        name.toLowerCase(),
        values.find((value) => value !== undefined)!.replaceAll("&amp;", "&"),
      ]
    )
  )
}

const sizeOf = (icon: LinkTag) => parseInt(icon.sizes) || 0

// Reads the <link rel="icon"> tags on a site's homepage, preferring SVG and then the
// largest size, and falls back to /favicon.ico. Lookups are cached for a week.
export const getFavicon = cache(async (href: string) => {
  const { origin } = new URL(href)

  try {
    const response = await fetch(origin, { next: { revalidate: ONE_WEEK } })
    const icons = [...(await response.text()).matchAll(/<link\b[^>]*>/gi)]
      .map(([tag]) => attributesOf(tag))
      .filter(
        (link) =>
          link.href && link.rel?.toLowerCase().split(/\s+/).includes("icon")
      )
    const icon =
      icons.find(
        (link) => link.type === "image/svg+xml" || link.href.endsWith(".svg")
      ) ??
      icons.reduce(
        (best, link) => (sizeOf(link) > sizeOf(best) ? link : best),
        icons[0]
      )

    if (icon) {
      return new URL(icon.href, response.url || origin).href
    }
  } catch {
    // Fall back to the conventional location below.
  }

  return `${origin}/favicon.ico`
})
