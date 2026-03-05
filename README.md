# NoteKeeper Front

Aplicação frontend do NoteKeeper construída com Vue 3, TypeScript e Vite.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js**: Versão 20.19.0 ou superior, ou versão 22.12.0 ou superior
- **pnpm**: Gerenciador de pacotes (recomendado)

Você pode verificar suas versões com:

```bash
node --version
pnpm --version
```

### Instalando o pnpm

Se você ainda não tem o pnpm instalado, instale-o globalmente:

```bash
npm install -g pnpm
```

Ou usando o Corepack (recomendado para Node.js 16.13+):

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Repositórios Relacionados

Este projeto é o frontend da aplicação NoteKeeper. O backend está em um repositório separado:

- **Backend API**: [notekeeper-api](https://github.com/brandaoplaster/notekeeper-api)
  ```bash
  git clone git@github.com:brandaoplaster/notekeeper-api.git
  ```

> **Importante**: Você precisa ter o backend rodando para que o frontend funcione corretamente.

## Instalação

Siga estes passos para configurar o projeto localmente:

### 1. Clone o repositório

```bash
git clone git@github.com:brandaoplaster/notekeeper-front.git
cd notekeeper-front
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env-example` para criar seu arquivo `.env`:

```bash
cp .env-example .env
```

Edite o arquivo `.env` e configure a URL da API de acordo com seu backend:

```env
VITE_API_URL=http://localhost:3000/api
```

> **Nota**: Certifique-se de que a API do backend está rodando na URL configurada antes de iniciar o frontend.

## Scripts Disponíveis

### Desenvolvimento

Inicia o servidor de desenvolvimento com hot-reload:

```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173` (porta padrão do Vite).

### Build

Compila a aplicação para produção:

```bash
pnpm build
```

Isso irá:
1. Executar a verificação de tipos com TypeScript
2. Compilar a aplicação para produção na pasta `dist`

### Preview

Visualiza a build de produção localmente:

```bash
pnpm preview
```

### Testes

Executa os testes unitários:

```bash
pnpm test:unit
```

Executa os testes e gera relatório de cobertura:

```bash
pnpm vitest run --coverage
```

### Linting

Executa os linters para verificar a qualidade do código:

```bash
pnpm lint
```

Isso executará tanto o oxlint quanto o eslint com correção automática habilitada.

### Formatação

Formata o código com Prettier:

```bash
pnpm format
```

### Verificação de Tipos

Executa a verificação de tipos do TypeScript:

```bash
pnpm type-check
```

## Stack Tecnológica

- **Vue 3**: Framework JavaScript progressivo
- **TypeScript**: Superset tipado do JavaScript
- **Vite**: Ferramenta de build de nova geração
- **Vue Router**: Roteador oficial para Vue.js
- **Pinia**: Gerenciamento de estado para Vue
- **Axios**: Cliente HTTP para requisições à API
- **VeeValidate**: Validação de formulários para Vue
- **Tailwind CSS**: Framework CSS utility-first
- **Vitest**: Framework de testes unitários

## Estrutura do Projeto

```
notekeeper-front/
├── src/
│   ├── components/     # Componentes Vue
│   ├── views/          # Componentes de página
│   ├── stores/         # Stores do Pinia
│   ├── router/         # Configuração do Vue Router
│   ├── assets/         # Arquivos estáticos
│   └── main.ts         # Ponto de entrada da aplicação
├── public/             # Arquivos públicos estáticos
├── .env-example        # Exemplo de variáveis de ambiente
└── vite.config.ts      # Configuração do Vite
```

## Configuração

### Variáveis de Ambiente

A aplicação utiliza as seguintes variáveis de ambiente:

- `VITE_API_URL`: URL base da API do backend (obrigatória)

Todas as variáveis de ambiente devem ter o prefixo `VITE_` para serem expostas ao código do cliente.
