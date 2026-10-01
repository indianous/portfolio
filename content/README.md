# Conteúdo do site

Todo o conteúdo do portfólio fica aqui, em Markdown. Para adicionar ou editar um projeto, post ou
experiência, basta criar ou alterar um arquivo `.md`: nenhum componente precisa mudar.

Cada arquivo começa com um bloco de **frontmatter** (YAML entre `---`), seguido do corpo em
Markdown. O frontmatter é validado nos testes e no build: um campo faltando ou num formato errado
falha com o caminho do arquivo e o campo com problema.

- O **nome do arquivo** vira o endereço da página: `content/projects/base-ds.md` →
  `/projects/base-ds`. Use letras minúsculas, números e hífens.
- **Datas** no formato `AAAA-MM-DD` (`2026-09-01`); meses da trajetória em `AAAA-MM` (`2024-03`).
- **Listas** entre colchetes (`[React, Node.js]`) ou uma por linha, com `-`.
- No corpo, comece os títulos por `##`: o `#` é o título da página, que vem do frontmatter.

## Projetos — `projects/*.md`

| Campo          | Obrigatório | Descrição                                                         |
| -------------- | ----------- | ----------------------------------------------------------------- |
| `title`        | sim         | Nome do projeto.                                                  |
| `summary`      | sim         | Uma ou duas frases para o card da vitrine.                        |
| `technologies` | sim         | Tecnologias usadas (pelo menos uma). Alimentam o filtro.          |
| `date`         | sim         | Data de início ou lançamento. Desempata a ordem.                  |
| `repoUrl`      | não         | Link do repositório (URL completa). Omita se o repo for privado.  |
| `liveUrl`      | não         | Link do site no ar (URL completa).                                |
| `cover`        | não         | Imagem de capa, a partir de `public/` (`/images/projeto.png`).    |
| `featured`     | não         | `true` para destacar na página inicial. Padrão: `false`.          |
| `order`        | não         | Posição na vitrine (menor primeiro). Sem `order`, vai para o fim. |

Na mesma tecnologia, use sempre a mesma grafia (`Node.js`, não `node`): o filtro diferencia.

**Estudo de caso:** se o corpo do arquivo tiver texto, o projeto ganha uma página de estudo de
caso. Sugestão de seções: `## Problema`, `## Arquitetura`, `## Resultados`. Sem corpo, o projeto
aparece só na vitrine.

## Posts — `posts/*.md`

| Campo     | Obrigatório | Descrição                                                    |
| --------- | ----------- | ------------------------------------------------------------ |
| `title`   | sim         | Título do post.                                              |
| `summary` | sim         | Resumo para a lista do blog e para buscadores.               |
| `date`    | sim         | Data de publicação. O blog lista do mais recente.            |
| `tags`    | não         | Assuntos do post.                                            |
| `draft`   | não         | `true` deixa o post fora do site publicado. Padrão: `false`. |

Rascunhos aparecem no `npm run dev`, mas não no build de produção.

## Trajetória — `experience/*.md`

| Campo          | Obrigatório | Descrição                                        |
| -------------- | ----------- | ------------------------------------------------ |
| `role`         | sim         | Cargo.                                           |
| `company`      | sim         | Empresa.                                         |
| `start`        | sim         | Início, em `AAAA-MM`.                            |
| `end`          | não         | Fim, em `AAAA-MM`. Sem `end`, é o emprego atual. |
| `location`     | não         | Cidade ou "Remoto".                              |
| `technologies` | não         | Tecnologias usadas.                              |

O corpo do arquivo é a descrição da experiência. A trajetória é listada da mais recente para a
mais antiga.

## O que ainda é exemplo

Os posts em `posts/` são exemplos para o desenvolvimento das próximas etapas: substitua-os por
conteúdo real. Eles ficam com `draft: true` e não vão ao ar.
