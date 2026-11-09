import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ayukumar261.com"),
}

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
