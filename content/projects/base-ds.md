---
title: base-ds
summary: Design system em React com tokens de design, tema claro e escuro e componentes acessíveis, publicado no GitHub Packages.
technologies: [React, TypeScript, Tailwind CSS, Storybook]
date: 2026-07-02
repoUrl: https://github.com/indianous/base-ds
featured: true
order: 1
---

## Problema

Cada aplicação reimplementava botões, formulários e navegação, com cores e espaçamentos
diferentes e acessibilidade irregular.

## Arquitetura

- Tokens de design expostos como CSS custom properties, com utilitários gerados para o Tailwind
  v3 e v4.
- Tema escuro trocando só os tokens semânticos, com o contraste verificado nos dois temas.
- Build dividido por componente: o app leva ao navegador só o que usa.

## Resultados

Ao trocar o bundle único pelo build dividido por componente, o JS que o base-ds acrescenta a uma
página caiu de cerca de 950 KB para cerca de 48 KB.
