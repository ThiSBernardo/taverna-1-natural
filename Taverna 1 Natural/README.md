# Taverna 1 Natural

Plataforma e Mesa Virtual (VTT) brasileira para RPG de mesa online, desenvolvida em React 19, TypeScript, Tailwind CSS v4 e Vite.

## 🎲 Funcionalidades

- **Dashboard Principal**: Acesso rápido a campanhas ativas, novidades, criação de personagens e atalhos.
- **Criação de Personagens (Wizard em 5 Passos)**: Suporte a múltiplos sistemas (D&D 5e, Ordem Paranormal, Tormenta 20, Fabula Ultima, etc.).
- **Ficha de Personagem Completa**: Atributos, perícias, inventário, habilidades, ataques e biografia.
- **Rolador de Dados 3D Integrado**: Suporte a dados poliédricos com física em tempo real e cálculo automático de modificadores.
- **Mesa Virtual (VTT)**: Grid de mapa tático, sincronização de tokens, gerenciador de iniciativa e chat.
- **Descubra & Comunidade**: Busca de jogadores, campanhas abertas e mesas por disponibilidade.
- **Guildas & Loja de Cosméticos**: Sistema de grupos, dados personalizados e skins de ficha.

## 🛠️ Tecnologias

- **React 19**
- **TypeScript 5.7+**
- **Vite 6+**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide React** (Ícones)

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ (recomendado Node.js 20 ou 22)
- npm 9+

### Instalação

```bash
npm install
```

### Desenvolvimento

Inicia o servidor de desenvolvimento na porta `5173`:

```bash
npm run dev
```

Acesse no navegador: `http://localhost:5173`

### Build de Produção

Compila o TypeScript e empacota os assets estáticos na pasta `dist/`:

```bash
npm run build
```

### Visualização do Build

```bash
npm run preview
```

## 📦 Estrutura do Projeto

```text
Taverna 1 Natural/
├── public/                 # Assets públicos estáticos (imagens, covers)
├── src/
│   ├── assets/             # Assets compilados pelo Vite
│   ├── components/         # Componentes React modularizados
│   │   ├── campaigns/      # Campanhas, VTT e sessões
│   │   ├── characters/     # Fichas, wizards e editores
│   │   ├── dice/           # Rolador de dados 3D
│   │   ├── discover/       # Busca e comunidade
│   │   ├── guilds/         # Sistema de guildas
│   │   ├── layout/         # Header, navegação e modais globais
│   │   ├── library/        # Biblioteca e perfis públicos
│   │   └── shop/           # Loja de cosméticos e dados
│   ├── services/           # Regras de regras de RPG, dados e persistência (LocalStorage)
│   ├── types/              # Definições de tipos TypeScript
│   ├── App.tsx             # Componente raiz da aplicação
│   ├── index.css           # Estilos globais e tokens Tailwind CSS v4
│   └── main.tsx            # Ponto de entrada React
├── index.html              # Template HTML principal
├── package.json            # Metadados e dependências
├── tsconfig.json           # Configuração do TypeScript
└── vite.config.ts          # Configuração do Vite
```
