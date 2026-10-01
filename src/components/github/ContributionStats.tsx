import { BarChart, Text } from '@indianous/base-ds'
import { formatYearMonth } from '@/lib/dates'
import type { ContributionSummary } from '@/lib/github/types'

interface ContributionStatsProps {
  contributions: ContributionSummary
}

export function ContributionStats({ contributions }: ContributionStatsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Text size="lg" weight="semibold">
        {contributions.total} contribuições no último ano
      </Text>
      <BarChart
        data={contributions.months.map(({ month, count }) => ({
          label: formatYearMonth(month),
          values: [count],
        }))}
        seriesNames={['Contribuições']}
        tableTitle="Contribuições por mês"
        labelColumnTitle="Mês"
      />
    </div>
  )
}
