# Albarra Italian — Cardápio Digital

Site de pedidos para a Albarra Italian. Cliente escolhe massa, molho e adicionais,
finaliza o pedido e ele é enviado pelo WhatsApp + salvo no banco de dados (Firebase).
Você gerencia tudo (cardápio, pedidos, campos do formulário e configurações) por um
painel próprio, sem precisar editar código.

## Como rodar localmente (opcional, para testar antes de publicar)

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Como publicar de verdade (recomendado: Vercel)

1. Crie uma conta gratuita em https://vercel.com (pode entrar com GitHub ou e-mail)
2. Crie um repositório no GitHub e suba esta pasta inteira nele
   (ou, mais simples: na Vercel, escolha "Add New Project" → "Deploy" e arraste a pasta)
3. A Vercel detecta automaticamente que é um projeto Vite/React e configura tudo
4. Em alguns minutos você recebe um link do tipo `albarra-italian.vercel.app`
5. Para domínio próprio (ex: `albarraitalian.com.br`): compre o domínio em qualquer
   registrador (Registro.br, Hostinger, GoDaddy) e em Project Settings → Domains na
   Vercel, siga o passo a passo para apontar o domínio

Alternativa: Netlify funciona de forma muito parecida (https://netlify.com).

## Configurar as regras de segurança do Firestore

No console do Firebase (https://console.firebase.google.com), vá em:
**Build → Firestore Database → Regras**

Substitua o conteúdo pelo que está no arquivo `firestore.rules` deste projeto, e clique
em "Publicar". Isso evita que estranhos consigam mexer no seu banco de dados.

## Como usar o painel administrativo

Acesse o site e clique no ícone de engrenagem (⚙) no canto superior direito do cardápio,
ou adicione `#admin` ao final do link do site (ex: `seusite.com/#admin`).

Senha padrão: `albarra2026` — **troque assim que possível** em
Painel → Configurações → Senha do painel.

No painel você tem 4 abas:
- **Pedidos**: todos os pedidos recebidos, com status (novo / preparando / entregue)
- **Cardápio**: adicionar, editar ou remover pratos, molhos e adicionais
- **Formulário**: criar, editar, reordenar ou remover os campos que o cliente preenche
  ao finalizar o pedido (ex: adicionar CEP, cidade, ponto de referência)
- **Configurações**: nome da loja, tagline, número de WhatsApp e senha do painel

## Estrutura do projeto

```
src/
  firebase.js          → conexão com o Firestore (banco de dados)
  theme.js              → cores e estilos compartilhados
  App.jsx               → estado geral e roteamento (cliente / painel)
  ClientView.jsx         → tela do cliente (cardápio, carrinho, checkout)
  AdminLogin.jsx          → tela de login do painel
  AdminView.jsx           → estrutura de abas do painel
  Sheet.jsx                → modal reutilizável (carrinho, checkout)
  admin/
    OrdersTab.jsx           → lista de pedidos
    MenuTab.jsx              → gestão do cardápio
    FormFieldsTab.jsx         → gestão dos campos do formulário
    SettingsTab.jsx            → configurações gerais
```

## Importante

- A chave do Firebase (`apiKey`) que aparece no código é pública por natureza —
  isso é normal e esperado pelo próprio Firebase. Quem protege seus dados de fato
  são as regras de segurança do Firestore (arquivo `firestore.rules`).
- Antes de divulgar o site, troque o número de WhatsApp e a senha do painel em
  Configurações.
