import { Button } from '@indianous/base-ds'

export function SkipLink() {
  return (
    <Button
      as="a"
      href="#conteudo"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
    >
      Pular para o conteúdo
    </Button>
  )
}
