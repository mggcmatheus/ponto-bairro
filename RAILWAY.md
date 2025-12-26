# Configuração para Railway

## Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente no Railway:

1. **DATABASE_URL**: URL de conexão com o PostgreSQL
   - Exemplo: `postgresql://usuario:senha@host:5432/ponto_bairro?schema=public`

2. **NEXTAUTH_URL**: URL da aplicação em produção
   - Exemplo: `https://ponto-bairro-production.up.railway.app`

3. **NEXTAUTH_SECRET**: Chave secreta (gere com `openssl rand -base64 32`)

4. **AUTH_TRUST_HOST**: `true` (para confiar no host do Railway)

## Setup do Banco de Dados (Automático)

As migrações e o seed inicial são executados automaticamente quando a aplicação inicia em produção.

### Configuração no Railway

O Railway executará automaticamente:
1. `npm install` - Instala as dependências
2. `npm run build` - Gera o cliente Prisma e faz o build da aplicação
3. `npm start` - Aplica migrações, executa seed e inicia o servidor

**Nota:** Não é necessário configurar um Start Command customizado. O Railway usa `npm start` por padrão, que já está configurado para:
- `prisma migrate deploy` (ou `prisma db push` como fallback) - Aplica as migrações
- `tsx prisma/seed.ts` - Popula o banco com dados iniciais (usuário admin e categorias)
- `next start` - Inicia a aplicação na porta definida pelo Railway (variável PORT)

### Execução Manual (Opcional)

Se precisar executar manualmente:

```bash
# Apenas migrações
railway run npm run db:migrate:deploy

# Migrações + Seed
railway run npm run setup:prod
```

## Verificando o Setup

Após o deploy, verifique se as tabelas foram criadas:

```bash
railway run npx prisma studio
```

Ou conecte diretamente ao banco e verifique:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Você deve ver as seguintes tabelas:
- usuarios
- categorias
- subcategorias
- estandes
- imagens_estande

