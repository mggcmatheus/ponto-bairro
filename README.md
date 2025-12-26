# PontoBairro

Plataforma hiperlocal de anúncios de serviços, comércios e produtos do bairro.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **PostgreSQL** (banco de dados externo)
- **Prisma ORM**
- **NextAuth.js** (autenticação)
- **Leaflet** (mapas)
- **Tailwind CSS** (estilização)
- **Zod** (validação)

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL (banco de dados configurado)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd ponto-bairro
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Renomeie o arquivo env.example para .env
cp env.example .env
# Ou crie manualmente o arquivo .env baseado no env.example
```

Edite o arquivo `.env` e configure:
- `DATABASE_URL`: URL de conexão com o PostgreSQL (ex: `postgresql://usuario:senha@localhost:5432/ponto_bairro?schema=public`)
- `NEXTAUTH_URL`: URL da aplicação (ex: `http://localhost:3000`)
- `NEXTAUTH_SECRET`: Chave secreta (gere com `openssl rand -base64 32`)

4. Configure o banco de dados:
```bash
# Gerar o cliente Prisma
npm run db:generate

# Aplicar as migrações
npm run db:push

# Popular o banco com dados iniciais (usuário admin e categorias de exemplo)
npm run db:seed
```

**Credenciais do admin padrão:**
- Email: `admin@pontobairro.com`
- Senha: `admin123`

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 👥 Tipos de Usuário

### ADMIN
- Gerenciar categorias e subcategorias
- Gerenciar usuários
- Ativar/desativar estandes

### ANUNCIANTE
- Criar e editar seu próprio estande
- Upload de imagem de capa
- Definir localização no mapa

## 📁 Estrutura do Projeto

```
src/
 ├── app/
 │   ├── (auth)/
 │   ├── admin/          # Painel administrativo
 │   ├── anunciante/     # Painel do anunciante
 │   ├── api/            # Rotas da API
 │   └── page.tsx        # Página principal (mapa)
 ├── components/         # Componentes React
 ├── lib/
 │   ├── prisma.ts       # Cliente Prisma
 │   ├── auth.ts         # Configuração NextAuth
 │   └── permissoes.ts   # Sistema de permissões
 └── types/              # Tipos TypeScript
```

## 🗄️ Modelos de Dados

- **Usuario**: Usuários do sistema (ADMIN ou ANUNCIANTE)
- **Categoria**: Categorias de estandes
- **Subcategoria**: Subcategorias (opcionais)
- **Estande**: Anúncios dos comerciantes
- **ImagemEstande**: Imagens dos estandes (armazenadas como bytea no PostgreSQL)

## 🔐 Autenticação

O sistema usa NextAuth.js com autenticação por credenciais (email + senha). Após o login, os usuários são redirecionados:
- **ADMIN** → `/admin/dashboard`
- **ANUNCIANTE** → `/anunciante/dashboard`

## 🗺️ Mapa

O mapa utiliza Leaflet com tiles do OpenStreetMap. Os estandes são exibidos como pins no mapa e podem ser filtrados por categoria, subcategoria ou pesquisa textual.

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run db:generate` - Gera cliente Prisma
- `npm run db:push` - Aplica mudanças no schema ao banco
- `npm run db:migrate` - Cria migração
- `npm run db:studio` - Abre Prisma Studio
- `npm run db:seed` - Popula o banco com dados iniciais

## 🎯 Funcionalidades Principais

### Página Principal
- Visualização de estandes no mapa
- Filtros por categoria, subcategoria e pesquisa
- Modal com detalhes do estande ao clicar no pin

### Painel Admin
- CRUD de categorias
- CRUD de subcategorias
- CRUD de usuários
- Gerenciamento de estandes (ativar/desativar)

### Painel Anunciante
- Cadastro/edição de estande
- Upload de imagem de capa
- Seleção de localização no mapa (pin arrastável)

## 📄 Licença

Este projeto é privado e de uso pessoal.

