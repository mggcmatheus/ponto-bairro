import { NextRequest, NextResponse } from "next/server"
import { requerAdmin } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const categoriaSchema = z.object({
  nome: z.string().min(1),
  slug: z.string().min(1),
  ativa: z.boolean().optional(),
})

export async function GET() {
  try {
    await requerAdmin()
    const categorias = await prisma.categoria.findMany({
      include: {
        subcategorias: {
          orderBy: { nome: "asc" },
        },
      },
      orderBy: { nome: "asc" },
    })
    return NextResponse.json(categorias)
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    return NextResponse.json({ erro: "Erro ao buscar categorias" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requerAdmin()
    const body = await request.json()
    const data = categoriaSchema.parse(body)

    const categoria = await prisma.categoria.create({
      data: {
        nome: data.nome,
        slug: data.slug,
        ativa: data.ativa ?? true,
      },
    })

    return NextResponse.json(categoria, { status: 201 })
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ erro: error.errors }, { status: 400 })
    }
    return NextResponse.json({ erro: "Erro ao criar categoria" }, { status: 500 })
  }
}

