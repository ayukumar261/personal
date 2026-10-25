import { collection, config, fields } from "@keystatic/core"

export const showAdminUI = process.env.NODE_ENV === "development"

export default config({
  storage: { kind: "local" },
  collections: {
    posts: collection({
      label: "Posts",
      columns: ["title", "publishedDate", "draft"],
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
        }),
        description: fields.text({ label: "Description", multiline: true }),
        publishedDate: fields.date({
          label: "Publish date",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
          description:
            "Displayed on the post; this does not schedule publishing.",
        }),
        draft: fields.checkbox({
          label: "Draft",
          defaultValue: true,
          description: "Drafts are hidden from the public post pages.",
        }),
        content: fields.markdoc({
          label: "Content",
          options: {
            image: {
              directory: "public/images/posts",
              publicPath: "/images/posts/",
            },
          },
        }),
      },
    }),
  },
})
