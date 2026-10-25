"use client"

import { makePage } from "@keystatic/next/ui/app"
import { useSyncExternalStore } from "react"

import config from "@/keystatic.config"

const KeystaticEditor = makePage(config)
const subscribe = () => () => {}

export default function KeystaticApp() {
  const supportsWebCrypto = useSyncExternalStore(
    subscribe,
    () => Boolean(window.crypto?.subtle),
    () => null
  )

  if (supportsWebCrypto === null) {
    return null
  }

  if (!supportsWebCrypto) {
    const secureUrl = new URL(window.location.href)
    secureUrl.protocol = "https:"

    return (
      <main className="mx-auto max-w-lg space-y-4 px-6 py-16">
        <h1 className="text-2xl font-semibold">Open the editor over HTTPS</h1>
        <p className="leading-relaxed text-muted-foreground">
          The content editor needs a secure connection. Use the HTTPS link
          printed when you start the app. On the computer running the app, you
          can also use localhost.
        </p>
        <a className="inline-block underline" href={secureUrl.href}>
          Open secure editor
        </a>
      </main>
    )
  }

  return <KeystaticEditor />
}
