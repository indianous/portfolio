---
title: Ecommerce
summary: Loja virtual completa, com catálogo, pagamento por Pix, acompanhamento de pedidos e painel administrativo para vendas e estoque.
technologies: [React, TypeScript, Tailwind CSS, Java, PostgreSQL]
date: 2026-07-02
liveUrl: https://ecommerce.joaovictornascimento.com.br/
featured: true
order: 1
---

## O que é

É uma loja virtual completa. O cliente escolhe os produtos, realiza o pagamento e acompanha a entrega diretamente pelo site. A equipe da loja gerencia todas as operações por meio de um painel administrativo exclusivo, que controla pedidos, estoque, entregas e a personalização da loja.

## Para quem compra

### Encontrar produtos

- Navegação intuitiva pelo catálogo, busca por nome e filtros por categoria ou ofertas em promoção.
- Página individual para cada produto, contendo fotos, descrição detalhada, preço e avaliações de outros compradores.
- Cálculo de frete diretamente na página do produto mediante a digitação do CEP.
- Recurso de lista de desejos para salvar itens e acompanhá-los posteriormente.

### Compra

- **Formas de pagamento:**
  - Pix gerado diretamente no site.
  - Pagamento presencial na retirada do produto.
  - Transações por meio de gateways de pagamento, como Stripe e PagSeguro.
- **Opções de entrega:**
  - Entrega no endereço cadastrado.
  - Retirada gratuita em um dos pontos físicos da loja.
- Inclusão de cupons de desconto no carrinho ou checkout.

### Acompanhamento

- Seção "Meus pedidos" para monitorar o status da entrega, o andamento do pagamento e os itens adquiridos.
- Envio de notificações ou e-mails automáticos a cada alteração no status do pedido.
- **Avaliações:** após a conclusão da compra, o cliente pode deixar um comentário acompanhado de fotos. As avaliações passam por moderação da loja antes de serem publicadas.

### Perfil

- **Dados cadastrais:** gerenciamento de informações pessoais, CPF e endereços de entrega.
- **Recuperação de senha:** processo simplificado de redefinição por e-mail.
- **Verificação em duas etapas (opcional):** camada extra de segurança que solicita um código gerado por aplicativo autenticador no celular durante o login.
- **Segurança da conta:** exigência de e-mail confirmado para finalizar pedidos e alertas enviados pela loja em caso de alterações de senha ou e-mail.

## Para a equipe da loja

O painel administrativo é dividido por áreas com controle de permissões de acesso:

- **Vendas:** gerenciamento de pedidos, pagamentos, etiquetas de envio, rastreio e solicitações de troca ou cancelamento. Permite também o registro manual de vendas realizadas por WhatsApp ou telefone.
- **Catálogo:** administração de produtos, fotos, categorias, promoções e cupons, com suporte à importação e exportação de dados via planilha.
- **Estoque:** controle de entradas, saídas e histórico por produto, com baixa automática a cada venda realizada.
- **Pessoas:** gestão de clientes, funcionários e definição de permissões de acesso ao sistema.
- **Site:** personalização de logotipo, banners da página inicial, menus, redes sociais, pontos de retirada, meios de pagamento e integração com transportadoras.
- **Sistema:** visualização de métricas de vendas e logs de auditoria (registro de ações realizadas por cada usuário no painel).

## Segurança

- Os dados do cartão de crédito nunca são armazenados pela loja, sendo utilizados exclusivamente no momento do processamento do pagamento.
- A confirmação de pagamento ocorre estritamente via comunicação oficial do gateway (webhook/API), ignorando telas intermediárias.
- As senhas são armazenadas com criptografia segura, e a autenticação em duas etapas está disponível tanto para clientes quanto para a equipe.

## Atualizações futuras

- Emissão automatizada de notas fiscais.
- Emissão de declaração de conteúdo para os pedidos.
