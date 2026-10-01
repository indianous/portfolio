import { Heading, Image, Text } from '@indianous/base-ds'
import type { Components } from 'hast-util-to-jsx-runtime'
import { AppLink } from '@/components/AppLink'

// Elemento do Markdown → componente. Títulos, parágrafos, imagens e links usam o base-ds; listas,
// citações, código, tabelas e divisórias não têm equivalente nele e ficam nativos, só com tokens.
// Código sem realce até o base-ds ter tokens para isso (indianous/base-ds#59).

const linkClassName = 'text-primary underline underline-offset-2 hover:text-primary-hover'

export const markdownComponents: Components = {
  h1: ({ children, id }) => (
    <Heading as="h2" size="3xl" id={id}>
      {children}
    </Heading>
  ),
  h2: ({ children, id }) => (
    <Heading as="h2" size="2xl" id={id}>
      {children}
    </Heading>
  ),
  h3: ({ children, id }) => (
    <Heading as="h3" size="xl" id={id}>
      {children}
    </Heading>
  ),
  h4: ({ children, id }) => (
    <Heading as="h4" size="xl" weight="medium" id={id}>
      {children}
    </Heading>
  ),
  h5: ({ children, id }) => (
    <Heading as="h5" size="xl" weight="medium" id={id}>
      {children}
    </Heading>
  ),
  h6: ({ children, id }) => (
    <Heading as="h6" size="xl" weight="medium" id={id}>
      {children}
    </Heading>
  ),
  p: ({ children }) => <Text as="p">{children}</Text>,
  a: ({ children, href = '' }) =>
    href.startsWith('/') && !href.startsWith('//') ? (
      <AppLink href={href} className={linkClassName}>
        {children}
      </AppLink>
    ) : (
      <a href={href} className={linkClassName}>
        {children}
      </a>
    ),
  img: ({ src, alt }) => <Image src={typeof src === 'string' ? src : ''} alt={alt ?? ''} />,
  ul: ({ children }) => <ul className="flex list-disc flex-col gap-1 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="flex list-decimal flex-col gap-1 pl-6">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="flex flex-col gap-2 border-l-4 border-border pl-4 text-muted-foreground">
      {children}
    </blockquote>
  ),
  // tabIndex: blocos com rolagem horizontal precisam ser alcançáveis pelo teclado.
  pre: ({ children }) => (
    <pre
      tabIndex={0}
      className="overflow-x-auto rounded-md bg-muted p-4 font-mono text-sm [&>code]:bg-transparent [&>code]:p-0"
    >
      {children}
    </pre>
  ),
  code: ({ children, className }) => (
    <code
      className={['rounded-sm bg-muted px-1 font-mono text-sm', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div tabIndex={0} className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border border-border px-3 py-2">{children}</td>,
  hr: () => <hr className="border-border" />,
}
