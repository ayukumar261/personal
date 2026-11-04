// Post descriptions are plain text where `backticks` mark inline code, as in Markdown.
const INLINE_CODE = /`([^`]+)`/g

export function plainDescription(description: string) {
  return description.replace(INLINE_CODE, "$1")
}

export function renderDescription(description: string) {
  return description.split(INLINE_CODE).map((part, index) =>
    index % 2 === 1 ? (
      <code
        key={index}
        className="rounded-[0.35em] bg-muted px-[0.3em] py-[0.125em] font-mono text-[0.85em] forced-colors:border"
      >
        {part}
      </code>
    ) : (
      part
    )
  )
}
