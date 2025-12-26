import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Função auxiliar para gerar slug a partir do nome
function gerarSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, '') // Remove hífens no início e fim
}

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

  // Dados das categorias e subcategorias para produção
  const categorias = [
    {
      nome: "Comércio",
      slug: "comercio",
      subcategorias: [
        "Mercado",
        "Padaria",
        "Açougue",
        "Hortifruti",
        "Mercearia",
        "Distribuidora de Bebidas",
        "Papelaria",
        "Loja de Informática",
        "Loja de Celulares",
        "Farmácia",
        "Materiais de Construção",
        "Loja de Utilidades Domésticas",
      ],
    },
    {
      nome: "Serviços",
      slug: "servicos",
      subcategorias: [
        "Eletricista",
        "Encanador",
        "Pedreiro",
        "Pintor",
        "Marceneiro",
        "Serralheiro",
        "Vidraceiro",
        "Chaveiro",
        "Montador de Móveis",
        "Técnico em Informática",
        "Instalação de Ar-Condicionado",
        "Limpeza Residencial",
        "Dedetização",
        "Jardinagem",
        "Manutenção Geral",
      ],
    },
    {
      nome: "Alimentação",
      slug: "alimentacao",
      subcategorias: [
        "Restaurante",
        "Lanchonete",
        "Pizzaria",
        "Hamburgueria",
        "Marmitex",
        "Pastelaria",
        "Sorveteria",
        "Açaí",
        "Confeitaria",
        "Doces Caseiros",
        "Food Truck",
      ],
    },
    {
      nome: "Beleza e Estética",
      slug: "beleza-estetica",
      subcategorias: [
        "Salão de Cabeleireiro",
        "Barbearia",
        "Manicure e Pedicure",
        "Design de Sobrancelhas",
        "Estética Facial",
        "Estética Corporal",
        "Depilação",
        "Maquiagem",
        "Massagem",
      ],
    },
    {
      nome: "Automotivo",
      slug: "automotivo",
      subcategorias: [
        "Mecânica",
        "Auto Elétrica",
        "Borracharia",
        "Lava Jato",
        "Funilaria",
        "Guincho",
        "Troca de Óleo",
        "Alinhamento e Balanceamento",
        "Auto Peças",
        "Estética Automotiva",
      ],
    },
    {
      nome: "Pets",
      slug: "pets",
      subcategorias: [
        "Pet Shop",
        "Clínica Veterinária",
        "Banho e Tosa",
        "Adestramento",
        "Pet Sitter",
        "Hotel para Pets",
        "Venda de Ração",
      ],
    },
    {
      nome: "Educação",
      slug: "educacao",
      subcategorias: [
        "Reforço Escolar",
        "Aulas Particulares",
        "Inglês",
        "Informática Básica",
        "Música",
        "Dança",
        "Artes",
      ],
    },
    {
      nome: "Imóveis e Casa",
      slug: "imoveis-casa",
      subcategorias: [
        "Corretor de Imóveis",
        "Aluguel de Imóveis",
        "Mudanças e Frete",
        "Administração de Condomínio",
        "Segurança Residencial",
      ],
    },
  ]

  // Criar categorias e subcategorias
  for (const categoriaData of categorias) {
    const categoria = await prisma.categoria.upsert({
      where: { slug: categoriaData.slug },
      update: {
        nome: categoriaData.nome,
        ativa: true,
      },
      create: {
        nome: categoriaData.nome,
        slug: categoriaData.slug,
        ativa: true,
      },
    })

    console.log(`Categoria criada/atualizada: ${categoria.nome}`)

    // Criar subcategorias
    for (const nomeSubcategoria of categoriaData.subcategorias) {
      const slugSubcategoria = gerarSlug(nomeSubcategoria)
      
      await prisma.subcategoria.upsert({
        where: {
          categoriaId_slug: {
            categoriaId: categoria.id,
            slug: slugSubcategoria,
          },
        },
        update: {
          nome: nomeSubcategoria,
          ativa: true,
        },
        create: {
          categoriaId: categoria.id,
          nome: nomeSubcategoria,
          slug: slugSubcategoria,
          ativa: true,
        },
      })

      console.log(`  - Subcategoria criada/atualizada: ${nomeSubcategoria}`)
    }
  }

  console.log('\n✅ Seed de produção concluído com sucesso!')
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

