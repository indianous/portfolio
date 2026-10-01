import type { Element, ElementContent, Root } from 'hast'
import { bundledLanguagesInfo, codeToHtml, createCssVariablesTheme } from 'shiki'

// Tema do Shiki com as variáveis de realce do base-ds (indianous/base-ds#59): as cores vêm dos
// tokens e acompanham o tema escuro.
const baseDsTheme = createCssVariablesTheme({
  name: 'base-ds',
  variablePrefix: '--color-code-',
  fontStyle: true,
})

function textOf(node: ElementContent): string {
  if (node.type === 'text') return node.value
  if (node.type === 'element') return node.children.map(textOf).join('')
  return ''
}

function collectCodeBlocks(node: Root | Element, blocks: Element[]) {
  for (const child of node.children) {
    if (child.type !== 'element') continue
    if (child.tagName === 'pre') blocks.push(child)
    else collectCodeBlocks(child, blocks)
  }
}

function findLanguage(code: Element | undefined) {
  const classes = (code?.properties.className as string[] | undefined) ?? []
  const lang = classes.find((name) => name.startsWith('language-'))?.slice('language-'.length)
  if (!lang) return undefined
  return bundledLanguagesInfo.find((info) => info.id === lang || info.aliases?.includes(lang))
}

/**
 * Plugin rehype: realça os blocos de código no build e guarda no `<pre>` o código (`data-code`), o
 * nome da linguagem (`data-language`) e o HTML realçado (`data-html`), para o mapa de componentes
 * montar o `CodeBlock`. Linguagem ausente ou desconhecida: só o código, sem realce.
 */
export function rehypeHighlight() {
  return async (tree: Root) => {
    const blocks: Element[] = []
    collectCodeBlocks(tree, blocks)

    await Promise.all(
      blocks.map(async (pre) => {
        const code = pre.children.find(
          (child): child is Element => child.type === 'element' && child.tagName === 'code',
        )
        const text = (code ? textOf(code) : pre.children.map(textOf).join('')).replace(/\n$/, '')
        const language = findLanguage(code)

        pre.properties = { dataCode: text }
        if (language) {
          pre.properties.dataLanguage = language.name
          pre.properties.dataHtml = await codeToHtml(text, {
            lang: language.id,
            theme: baseDsTheme,
          })
        }
        pre.children = []
      }),
    )
  }
}
