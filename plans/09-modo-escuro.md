# Etapa 09 — Modo claro/escuro

**Objetivo:** alternância entre tema claro e escuro, respeitando a preferência do sistema e
lembrando a escolha do visitante.

## 1. Problemas encontrados

Levantados em 2026-10-01, com o base-ds v0.5.2 e o Next.js 16.3.6.

- ~~**Bloqueio: o base-ds não tem tema escuro.**~~ Resolvido na v0.4.10
  ([indianous/base-ds#52](https://github.com/indianous/base-ds/issues/52)). Com a classe `dark` no
  `<html>`, os tokens semânticos de cor trocam para a paleta escura; o `theme.css` define o
  `color-scheme` de cada tema, e o `theme-v4.css` (já importado em `globals.css`) traz
  `@custom-variant dark`. O README do base-ds pede `bg-background text-foreground` no `<body>`,
  que hoje não tem.
- **O que não muda no escuro:** os primitivos, os gráficos, o `overlay` e os tokens que não são de
  cor. O app já estiliza só com tokens semânticos; nada de `dark:` espalhado. O realce de código
  (base-ds 0.5.1) também tem os dois temas.
- **Flash de tema errado.** O servidor não sabe o tema do visitante, e a página é estática. Como no
  guia "Preventing flash before hydration" do Next.js 16: um script inline no `<head>` lê a
  escolha salva (ou o `prefers-color-scheme`) e aplica a classe antes da primeira pintura, com
  `try/catch` para `localStorage` indisponível. O `<html>` ganha `suppressHydrationWarning`, porque
  o script muda a classe antes da hidratação. Ler o tema de um cookie no servidor tiraria o site do
  modo estático.
- **Sem `next-themes`.** O README do base-ds o cita, mas a lógica é pequena (script, leitura e
  gravação seguras, preferência do sistema) e fica testada no app, sem dependência a mais.
- **Controle.** Decisão do usuário: `Button` do base-ds só com ícone, no `actions` do `Navbar`.
  Lua no tema claro, sol no escuro, com `aria-label` dizendo a ação ("Ativar tema escuro"). Os
  ícones vêm do `lucide-react` importados um a um, como o README do base-ds recomenda (o `Icon` do
  base-ds traria os ~650 KB de ícones); o `lucide-react` entra como dependência do app. No celular,
  o `Navbar` põe as ações no drawer "Mais ações".
- **Estado do botão sem erro de hidratação.** O botão lê a classe do `<html>` com
  `useSyncExternalStore` (no servidor, claro); um `MutationObserver` mantém o ícone em dia.
- **Escolha x sistema.** Sem escolha salva, o site segue o sistema, inclusive quando ele muda com a
  página aberta. Clicar salva a escolha, que passa a valer sobre o sistema.

## 2. Testes a incluir

**`src/lib/__tests__/theme.test.ts`**

- `resolveTheme(null, true)` → `'dark'`; `resolveTheme(null, false)` → `'light'`.
- A escolha salva vale mais que a preferência do sistema.
- `readSavedTheme` devolve `null` para valor inválido e quando o `localStorage` lança erro.
- `saveTheme` não quebra quando o `localStorage` lança erro.
- `applyTheme` liga e desliga a classe `dark` no `<html>`.

**`src/lib/__tests__/theme-script.test.ts`**

- O script inline aplica a classe certa para cada combinação de escolha salva e preferência do
  sistema, e não quebra sem `localStorage`.

**`src/components/theme/__tests__/ThemeToggle.test.tsx`**

- O rótulo descreve o tema de destino ("Ativar tema escuro" / "Ativar tema claro").
- Clicar alterna a classe no `<html>` e salva a escolha.
- Sem escolha salva, acompanha a mudança da preferência do sistema; com escolha salva, não.

**`src/components/layout/__tests__/SiteHeader.test.tsx`**

- O cabeçalho tem o botão de tema.

## 3. O que entra no projeto

**Dependência**

- `lucide-react` (os ícones `MoonIcon` e `SunIcon`), na mesma faixa que o base-ds usa.

**Tipos / lógica**

- `src/lib/theme.ts`: `Theme`, `THEME_STORAGE_KEY`, `resolveTheme`, `readSavedTheme`,
  `saveTheme`, `applyTheme`, `themeScript` (o script inline).

**Componentes**

- `src/components/theme/ThemeToggle.tsx` (client), no `actions` do `Navbar`.

**Layout**

- `src/app/layout.tsx`: script no `<head>`, `suppressHydrationWarning` no `<html>` e
  `bg-background text-foreground` no `<body>`.

**Páginas**

- Nenhuma página nova; conferir o contraste de todas as telas nos dois temas (verificação visual
  feita pelo usuário).
