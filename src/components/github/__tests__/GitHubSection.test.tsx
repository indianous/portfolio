import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { makeProfile } from '../../../../__tests__/stubs/github'
import { GitHubSection } from '@/components/github/GitHubSection'

describe('GitHubSection', () => {
  it('mostra título, link para o perfil, estatísticas e repositórios', () => {
    render(<GitHubSection profile={makeProfile()} />)
    expect(screen.getByRole('heading', { level: 2, name: 'No GitHub' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver perfil no GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/eu',
    )
    expect(screen.getByText('42 contribuições no último ano')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'repo' })).toBeInTheDocument()
  })

  it('não renderiza nada sem dados', () => {
    const { container } = render(<GitHubSection profile={null} />)
    expect(container).toBeEmptyDOMElement()
  })
})
