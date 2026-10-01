import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContributionStats } from '@/components/github/ContributionStats'

describe('ContributionStats', () => {
  it('mostra o total do ano e o gráfico com tabela acessível', () => {
    render(
      <ContributionStats
        contributions={{
          total: 209,
          months: [
            { month: '2026-08', count: 10 },
            { month: '2026-09', count: 32 },
          ],
        }}
      />,
    )
    expect(screen.getByText('209 contribuições no último ano')).toBeInTheDocument()
    const table = screen.getByRole('table', { name: 'Contribuições por mês' })
    expect(within(table).getByRole('columnheader', { name: 'Mês' })).toBeInTheDocument()
    expect(within(table).getByRole('columnheader', { name: 'Contribuições' })).toBeInTheDocument()
    expect(within(table).getByRole('rowheader', { name: 'set. de 2026' })).toBeInTheDocument()
  })
})
