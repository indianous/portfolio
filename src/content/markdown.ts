import 'server-only'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { markdownComponents } from '@/components/content/markdown-components'

// O slug roda depois da sanitização, que prefixaria os ids com `user-content-`.
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeSlug)
  .use(rehypeUnwrapImages)

/** Converte Markdown em componentes no servidor, sem levar o parser ao navegador. */
export async function renderMarkdown(markdown: string) {
  const tree = await processor.run(processor.parse(markdown))
  const children = toJsxRuntime(tree, { Fragment, jsx, jsxs, components: markdownComponents })
  return jsx('div', { className: 'flex flex-col gap-4', children })
}
