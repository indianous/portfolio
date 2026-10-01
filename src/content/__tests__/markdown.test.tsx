import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderMarkdown } from '@/content/markdown'

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: React.ComponentProps<'a'>) => (
    <a href={href} data-next-link="" {...rest}>
      {children}
    </a>
  ),
}))

async function renderContent(markdown: string) {
  return render(await renderMarkdown(markdown))
}

describe('renderMarkdown', () => {
  it('dá id aos títulos para servirem de âncora', async () => {
    await renderContent('## Arquitetura do sistema\n\n### Decisões')
    expect(
      screen.getByRole('heading', { level: 2, name: 'Arquitetura do sistema' }),
    ).toHaveAttribute('id', 'arquitetura-do-sistema')
    expect(screen.getByRole('heading', { level: 3, name: 'Decisões' })).toHaveAttribute(
      'id',
      'decisões',
    )
  })

  it('deixa os títulos abaixo da barra de navegação fixa ao seguir uma âncora', async () => {
    await renderContent('## Problema\n\n### Detalhe')
    expect(screen.getByRole('heading', { level: 2, name: 'Problema' })).toHaveClass('scroll-mt-16')
    expect(screen.getByRole('heading', { level: 3, name: 'Detalhe' })).toHaveClass('scroll-mt-16')
  })

  it('remove script e atributos de evento', async () => {
    const { container } = await renderContent(
      'Texto\n\n<script>alert(1)</script>\n\n<img src="x.png" alt="x" onerror="alert(1)">',
    )
    expect(container.querySelector('script')).toBeNull()
    expect(container.innerHTML).not.toContain('onerror')
    expect(container.innerHTML).not.toContain('alert(1)')
  })

  it('navega pelo Link do Next.js nos links internos e mantém os externos', async () => {
    await renderContent('[Projetos](/projects) e [GitHub](https://github.com/indianous)')
    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute('data-next-link')
    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/indianous',
    )
    expect(screen.getByRole('link', { name: 'GitHub' })).not.toHaveAttribute('data-next-link')
  })

  it('renderiza parágrafos, listas, tabelas e blocos de código', async () => {
    const { container } = await renderContent(
      [
        'Um parágrafo.',
        '',
        '- item um',
        '- item dois',
        '',
        '| Coluna | Valor |',
        '| ------ | ----- |',
        '| a      | 1     |',
        '',
        '```ts',
        'const x = 1',
        '```',
      ].join('\n'),
    )
    expect(screen.getByText('Um parágrafo.').tagName).toBe('P')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Coluna' })).toBeInTheDocument()
    expect(container.querySelector('pre code')).toHaveTextContent('const x = 1')
  })

  it('não deixa imagem sozinha dentro de parágrafo', async () => {
    const { container } = await renderContent('![Diagrama da arquitetura](/images/diagrama.png)')
    expect(screen.getByRole('img', { name: 'Diagrama da arquitetura' })).toBeInTheDocument()
    expect(container.querySelector('p img')).toBeNull()
  })

  it('realça blocos de linguagem conhecida com os tokens do base-ds', async () => {
    const { container } = await renderContent('```ts\nconst x = 1\n```')
    const block = screen.getByRole('figure', { name: 'Código em TypeScript' })
    expect(block).toHaveTextContent('TypeScript')
    expect(block.querySelector('pre code')).toHaveTextContent('const x = 1')
    expect(container.innerHTML).toContain('var(--color-code-token-keyword)')
  })

  it('mostra sem realce o bloco sem linguagem ou com linguagem desconhecida', async () => {
    const { container } = await renderContent(
      '```\nsem linguagem\n```\n\n```linguagem-inventada\n<b>intacto</b>\n```',
    )
    const blocks = screen.getAllByRole('figure', { name: 'Bloco de código' })
    expect(blocks).toHaveLength(2)
    expect(blocks[0]).toHaveTextContent('sem linguagem')
    expect(blocks[1]).toHaveTextContent('<b>intacto</b>')
    expect(container.querySelector('b')).toBeNull()
    expect(container.innerHTML).not.toContain('--color-code-token')
  })

  it('usa o Code do base-ds no código inline', async () => {
    await renderContent('Rode `npm test` antes.')
    expect(screen.getByText('npm test').tagName).toBe('CODE')
    expect(screen.getByText('npm test')).toHaveClass('bg-code-background')
  })
})
