# Next.js template

This is a Next.js template with shadcn/ui.

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

1. Select **Posts**, then create a post or open the included **Welcome** post.
2. Set the title, URL slug, description, and publish date. The date is displayed
   on the post and controls sorting; it does not schedule publication.
3. Write in the rich text editor. Uploaded images are saved under
   `public/images/posts/`.
4. New posts start with **Draft** checked. Uncheck it when the post is ready,
   then save. Drafts are hidden from both the list and individual post URLs.
5. Open <http://localhost:3100/posts> to view published posts. Refresh after
   saving changes in the editor.

Post files live in `content/posts/*.mdoc`; you can edit them directly as well.
The schema is defined in `keystatic.config.ts`, and the server-only Reader API
is configured in `lib/keystatic.ts`.

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
