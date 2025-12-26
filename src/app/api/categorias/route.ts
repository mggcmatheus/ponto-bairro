import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      where: { ativa: true },
      select: {
        id: true,
        nome: true,
        slug: true,
        ativa: true,
        subcategorias: {
          where: { ativa: true },
          select: {
            id: true,
            nome: true,
            slug: true,
            ativa: true,
          },
          orderBy: { nome: "asc" },
        },
      },
      orderBy: { nome: "asc" },
    })

    return NextResponse.json(categorias)
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return NextResponse.json(
      { erro: "Erro ao buscar categorias" },
      { status: 500 }
    )
  }
}

