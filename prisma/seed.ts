import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criar usuário admin padrão
  const senhaHash = await bcrypt.hash('9G6bfDsv*XgbKe', 10)
  
  const admin = await prisma.usuario.upsert({
    where: { email: 'mggcmatheus@gmail.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'mggcmatheus@gmail.com',
      senha_hash: senhaHash,
      tipo: 'ADMIN',
      ativo: true,
    },
  })

  console.log('Usuário admin criado:', admin)

  // Criar algumas categorias de exemplo
  const categoria1 = await prisma.categoria.upsert({
    where: { slug: 'servicos' },
    update: {},
    create: {
      nome: 'Serviços',
      slug: 'servicos',
      ativa: true,
    },
  })

  const categoria2 = await prisma.categoria.upsert({
    where: { slug: 'comercio' },
    update: {},
    create: {
      nome: 'Comércio',
      slug: 'comercio',
      ativa: true,
    },
  })

  console.log('Categorias criadas:', categoria1, categoria2)

  // Criar subcategorias de exemplo
  const subcategoria1 = await prisma.subcategoria.upsert({
    where: {
      categoriaId_slug: {
        categoriaId: categoria1.id,
        slug: 'eletricista',
      },
    },
    update: {},
    create: {
      categoriaId: categoria1.id,
      nome: 'Eletricista',
      slug: 'eletricista',
      ativa: true,
    },
  })

  const subcategoria2 = await prisma.subcategoria.upsert({
    where: {
      categoriaId_slug: {
        categoriaId: categoria2.id,
        slug: 'mercado',
      },
    },
    update: {},
    create: {
      categoriaId: categoria2.id,
      nome: 'Mercado',
      slug: 'mercado',
      ativa: true,
    },
  })

  console.log('Subcategorias criadas:', subcategoria1, subcategoria2)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

