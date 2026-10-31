const authorList = new Intl.ListFormat("en-US", {
  style: "long",
  type: "conjunction",
})

export function formatAuthors(authors: readonly { name: string }[]) {
  return authorList.format(authors.map(({ name }) => name))
}
