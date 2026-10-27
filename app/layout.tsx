"use client"

import Lenis from "lenis"
import { Geist_Mono, Inter, Newsreader } from "next/font/google"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === "/keystatic" || pathname.startsWith("/keystatic/")) {
      return
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let lenis: Lenis | undefined

    function updateScrolling() {
      lenis?.destroy()
      lenis = undefined

      if (!reducedMotion.matches) {
        lenis = new Lenis({
          autoRaf: true,
          anchors: true,
          allowNestedScroll: true,
          stopInertiaOnNavigate: true,
        })
      }
    }

    updateScrolling()
    reducedMotion.addEventListener("change", updateScrolling)

    return () => {
      reducedMotion.removeEventListener("change", updateScrolling)
      lenis?.destroy()
    }
  }, [pathname])

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        newsreader.variable,
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
