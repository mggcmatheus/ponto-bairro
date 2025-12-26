import { NextRequest, NextResponse } from "next/server"
import { requerAdmin } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const subcategoriaSchema = z.object({
  categoriaId: z.string().uuid(),
  nome: z.string().min(1),
  slug: z.string().min(1),
  ativa: z.boolean().optional(),
})

export async function GET() {
  try {
    await requerAdmin()
    const subcategorias = await prisma.subcategoria.findMany({
      include: {
        categoria: {
          select: { nome: true },
        },
      },
      orderBy: { nome: "asc" },
    })
    return NextResponse.json(subcategorias)
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    return NextResponse.json({ erro: "Erro ao buscar subcategorias" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requerAdmin()
    const body = await request.json()
    const data = subcategoriaSchema.parse(body)

    const subcategoria = await prisma.subcategoria.create({
      data: {
        categoriaId: data.categoriaId,
        nome: data.nome,
        slug: data.slug,
        ativa: data.ativa ?? true,
      },
    })

    return NextResponse.json(subcategoria, { status: 201 })
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ erro: error.errors }, { status: 400 })
    }
    return NextResponse.json({ erro: "Erro ao criar subcategoria" }, { status: 500 })
  }
}

