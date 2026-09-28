# Etapa 09 — Modo claro/escuro

**Objetivo:** alternância entre tema claro e escuro, respeitando a preferência do sistema e
lembrando a escolha do visitante.

## 1. Problemas encontrados

- **Bloqueio: o base-ds não tem tema escuro.** `src/styles/theme.css` e `theme-v4.css` definem os
  tokens só em `:root`. Pelo `CLAUDE.md`, não se contorna isso no app (sem sobrescrever as
  variáveis localmente). Esta etapa só começa depois que a issue [indianous/base-ds#52](https://github.com/indianous/base-ds/issues/52) for resolvida
  e publicada.
- **O que pedir na issue:** tokens escuros sob uma classe (`.dark`) ou atributo
  (`[data-theme="dark"]`), mantendo o teste de contraste (`src/tokens/contrast.test.ts`) nos dois
  temas, e a variante `dark` configurada no bloco `@theme` do v4.
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

- Atualizar `@indianous/base-ds` para a versão com tema escuro, conforme o CHANGELOG.

**Tipos / lógica**

- `src/lib/theme.ts`: `Theme = 'light' | 'dark' | 'system'`, `resolveTheme`, leitura/escrita
  seguras.

**Componentes**

- `ThemeToggle` (base-ds `Switch` ou `Button` com ícone), no `actions` do `Navbar`.
- Script inline anti-flash no `layout.tsx`.

**Páginas**

- Nenhuma página nova; conferir contraste de todas as telas nos dois temas (verificação visual
  feita pelo usuário).
