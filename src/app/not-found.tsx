import type { Metadata } from 'next'
import { Button, Heading, Text } from '@indianous/base-ds'

export const metadata: Metadata = {
  title: { absolute: 'Página não encontrada' },
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Heading as="h1" size="3xl">
        Página não encontrada
      </Heading>
      <Text color="muted">O endereço pode ter mudado ou a página ainda não existe.</Text>
      <Button as="a" href="/">
        Voltar para o início
      </Button>
    </div>
  )
}
