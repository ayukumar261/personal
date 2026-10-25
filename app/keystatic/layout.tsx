import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { showAdminUI } from "@/keystatic.config"
import KeystaticApp from "./keystatic"

export const metadata: Metadata = {
  title: "Keystatic",
  robots: { index: false, follow: false },
}

export default function KeystaticLayout() {
  if (!showAdminUI) {
    notFound()
  }

  return <KeystaticApp />
}
