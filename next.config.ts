import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.DEV_TAILSCALE_ORIGINS?.split(","),
  outputFileTracingIncludes: {
    "/posts/*": ["./content/posts/**/*"],
  },
}

export default nextConfig
