import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '@indianous/base-ds'

// Confirma que o base-ds roda no ambiente de teste com a mesma cópia de React do app:
// com duas instâncias, componentes com hooks quebram com "Invalid hook call".
describe('base-ds no ambiente de teste', () => {
  it('renderiza e responde a clique num Button', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Ver projetos</Button>)

    await userEvent.click(screen.getByRole('button', { name: 'Ver projetos' }))

    expect(onClick).toHaveBeenCalledOnce()
  })
})
