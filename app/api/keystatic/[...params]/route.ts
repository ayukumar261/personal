import { makeRouteHandler } from "@keystatic/next/route-handler"

import config, { showAdminUI } from "@/keystatic.config"

export const runtime = "nodejs"

// Local storage has no login. Keep both the editor and its API development-only.
const handlers = showAdminUI
  ? makeRouteHandler({ config })
  : {
      GET: () => new Response(null, { status: 404 }),
      POST: () => new Response(null, { status: 404 }),
    }

export const GET = handlers.GET
export const POST = handlers.POST
