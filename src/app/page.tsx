import { Button, Container, Heading, Text } from '@indianous/base-ds'

// Página provisória da etapa 01: usa só componentes simples do base-ds para medir
// quanto JS o pacote leva ao cliente. É substituída pela home na etapa 04.
export default function Home() {
  return (
    <Container as="main" width="3xl" spacing="relaxed">
      <Heading as="h1" size="3xl">
        Portfólio
      </Heading>
      <Text color="muted">Em construção.</Text>
      <Button as="a" href="https://github.com/indianous">
        GitHub
      </Button>
    </Container>
  )
}
