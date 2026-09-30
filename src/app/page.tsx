import { Button, Heading, Text } from '@indianous/base-ds'

// Página provisória: é substituída pela home na etapa 04.
export default function Home() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Heading as="h1" size="3xl">
        Portfólio
      </Heading>
      <Text color="muted">Em construção.</Text>
      <Button as="a" href="https://github.com/indianous">
        GitHub
      </Button>
    </div>
  )
}
