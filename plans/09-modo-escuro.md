# Etapa 09 — Modo claro/escuro

**Objetivo:** alternância entre tema claro e escuro, respeitando a preferência do sistema e
lembrando a escolha do visitante.

## 1. Problemas encontrados

- ~~**Bloqueio: o base-ds não tem tema escuro.**~~ Resolvido na v0.4.10
  ([indianous/base-ds#52](https://github.com/indianous/base-ds/issues/52)). Com a classe `dark` no
  `<html>`, os tokens semânticos de cor trocam para a paleta escura; o `theme.css` define o
  `color-scheme` de cada tema, e o `theme-v4.css` (já importado em `globals.css`) traz
  `@custom-variant dark`, que liga o `dark:` do Tailwind à classe. O teste de contraste do base-ds
  cobre os dois temas. Ver "Tema escuro" no README do base-ds antes de implementar.
- **O que não muda no escuro:** os primitivos, os gráficos, o `overlay` e os tokens que não são de
  cor. Estilizar só com os tokens semânticos para o tema funcionar sem `dark:` espalhado.
- **Flash de tema errado.** Aplicar a classe antes da primeira pintura, com um script inline
  pequeno no `<head>`; senão o site pisca claro antes de ficar escuro.
- **Acessibilidade.** O controle precisa de rótulo e estado (`Switch` do base-ds com
  `aria-checked`).

## 2. Testes a incluir

**`src/lib/__tests__/theme.test.ts`**

- `resolveTheme('system', prefersDark=true)` → `'dark'`.
- Preferência salva tem prioridade sobre a do sistema.
- Valor inválido no armazenamento cai para `'system'`.
- Acesso ao `localStorage` que lança erro não quebra a página.

**`src/components/theme/__tests__/ThemeToggle.test.tsx`**

- Clicar alterna a classe no `<html>` e salva a escolha.
- Rótulo acessível descreve o tema de destino.

**`src/app/__tests__/theme-script.test.ts`**

- O script inline aplica a classe correta para cada combinação de preferência salva e do sistema.

## 3. O que entra no projeto

**Dependência**

- Nenhuma: o tema escuro já está na versão instalada (v0.4.10 ou maior). Rodar
  `npm outdated @indianous/base-ds` ao começar, como em toda tarefa de UI.

**Tipos / lógica**

- `src/lib/theme.ts`: `Theme = 'light' | 'dark' | 'system'`, `resolveTheme`, leitura/escrita
  seguras.

**Componentes**

- `ThemeToggle` (base-ds `Switch` ou `Button` com ícone), no `actions` do `Navbar`.
- Script inline anti-flash no `layout.tsx`.

**Páginas**

- Nenhuma página nova; conferir contraste de todas as telas nos dois temas (verificação visual
  feita pelo usuário).
