// As datas do conteúdo não têm hora: formatadas em UTC para não voltar um dia por causa do fuso.

const fullDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' })
const monthYear = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

/** `2026-09-01` → "1 de setembro de 2026". */
export function formatDate(isoDate: string): string {
  return fullDate.format(new Date(`${isoDate}T00:00:00Z`))
}

/** `2016-01` → "jan. de 2016". */
export function formatYearMonth(yearMonth: string): string {
  return monthYear.format(new Date(`${yearMonth}-01T00:00:00Z`))
}
