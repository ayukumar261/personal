import Markdoc, { type Config } from "@markdoc/markdoc"

export const markdocConfig: Config = {
  nodes: {
    fence: {
      ...Markdoc.nodes.fence,
      transform(node) {
        return new Markdoc.Tag("CodeBlock", {
          code: node.attributes.content,
          language: node.attributes.language,
        })
      },
    },
    text: {
      ...Markdoc.nodes.text,
      transform(node) {
        // Definition labels stay on the baseline; inline references are raised.
        const content: string = node.attributes.content.replace(
          /^\[\^(\d+)\]:/,
          "$1:"
        )

        return content.split(/(\[\^\d+\])/g).map((text) => {
          const reference = /^\[\^(\d+)\]$/.exec(text)

          return reference ? new Markdoc.Tag("sup", {}, [reference[1]]) : text
        })
      },
    },
  },
}
