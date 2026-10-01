import GithubSlugger from 'github-slugger'
import type { Heading, Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

export interface TocHeading {
  id: string
  text: string
}

const parser = unified().use(remarkParse).use(remarkGfm)

function collectHeadings(nodes: RootContent[], headings: Heading[]) {
  for (const node of nodes) {
    if (node.type === 'heading') headings.push(node)
    else if ('children' in node) collectHeadings(node.children as RootContent[], headings)
  }
}

/**
 * Títulos `##` do Markdown para o índice. O `id` sai do mesmo `github-slugger` que o
 * `rehype-slug` usa no `renderMarkdown`, contando todos os títulos, para as âncoras baterem.
 */
export function extractHeadings(markdown: string): TocHeading[] {
  const headings: Heading[] = []
  collectHeadings((parser.parse(markdown) as Root).children, headings)

  const slugger = new GithubSlugger()
  return headings
    .map((heading) => ({ depth: heading.depth, text: toString(heading) }))
    .map(({ depth, text }) => ({ depth, text, id: slugger.slug(text) }))
    .filter(({ depth }) => depth === 2)
    .map(({ id, text }) => ({ id, text }))
}
