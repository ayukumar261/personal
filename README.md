# Ayush Kumar's personal website

Personal website and articles, built with Next.js, shadcn/ui, and Keystatic.

## Production deployment

The website is hosted at [https://ayukumar261.com](https://ayukumar261.com).
Dokploy manages the `personal` application in **Personal Website → production**.

- Source: this repository's `main` branch, build path `/`.
- Builder: Nixpacks with Node.js 22 (also specified in `.nvmrc`).
- Build: `pnpm run build`; start: `pnpm run start`; container port: `3000`.
- Dokploy environment: `NODE_ENV=production`, `PORT=3000`,
  `NIXPACKS_NODE_VERSION=22`, and `NEXT_TELEMETRY_DISABLED=1`.
- GitHub's push webhook triggers Dokploy automatically. Only pushes to `main`
  deploy this application. Check its **Deployments** tab for build status and logs.
- Cloudflare serves public HTTPS and forwards requests through the existing
  Dokploy tunnel to Traefik on the server. The Dokploy domain route uses port
  `3000` with its HTTPS toggle off because TLS is handled by Cloudflare and the
  encrypted tunnel.

To publish an update, commit your changes and push to `main`. Once that deployment
finishes, the new build is live. No local development server is needed for visitors.
The Meerkat hosting Dokploy and its internet connection must remain online.

The published LiveKit article is at
[Improving DTMF Signaling in LiveKit's Go SDK](https://ayukumar261.com/posts/improving-dtmf-signaling-in-livekits-go-sdk).

## Development from your MacBook

Run `pnpm dev` on this machine. It starts Next.js on localhost port 3100 and
automatically forwards that port through Tailscale over HTTPS, printing a link such as
<https://computer.taila17973.ts.net:3100/>. Open that link on your MacBook with
Tailscale connected to the same tailnet. Hot reload and `/keystatic` work through
the link.

Keystatic needs HTTPS when accessed from another device because its editor uses
the browser's Web Crypto API. If Tailscale prints a setup link, open it to enable
Serve/HTTPS for your tailnet, then restart `pnpm dev`. Localhost works over HTTP.

Choose another port with `pnpm dev --port 4000` or `PORT=4000 pnpm dev`; the
forwarding link follows the selected port. If Tailscale is unavailable, the
server still runs locally.

For another local HTTP server, forward its port with:

```bash
tailscale serve --bg --https=4000 http://127.0.0.1:4000
```

Forwarding persists across restarts. The app must be running for the link to
work. Remove a forwarding rule with `tailscale serve --https=4000 off`.

## Content editing with Keystatic

Run `pnpm dev` and open <http://localhost:3100/keystatic>. No account or
environment variables are needed in local mode.

1. Select **Posts**, then create a post or open an existing post.
2. Set the title and URL slug.
3. Write in the rich text editor. Uploaded images are saved under
   `public/images/posts/`.
4. New posts start with **Draft** checked. Uncheck it when the post is ready,
   then save. Drafts are hidden at their post URLs.
5. Open <http://localhost:3100/posts/your-slug> to view a published post, and
   link to it from `app/page.tsx`. Refresh after saving changes in the editor.

Post files live in `content/posts/*.mdoc`; you can edit them directly as well.
The schema is defined in `keystatic.config.ts`, and the server-only Reader API
is configured in `lib/keystatic.ts`.

Each published post gets a 1200 × 630 social preview at
`/posts/your-slug/opengraph-image`, using its title and the site's typography.
The **Description** field supplies the summary for LinkedIn and other link previews.
The preview fonts are bundled in `assets/fonts/` with their SIL Open Font Licenses.

To publish changes, commit the post files and uploaded images, then deploy a
new build. Public posts are generated at build time. The local editor and its
API return 404 in production (`pnpm build && pnpm start`). Editing on a
deployed site requires configuring [Keystatic GitHub mode](https://keystatic.com/docs/github-mode)
and its authentication first.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
