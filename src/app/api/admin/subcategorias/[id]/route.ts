import { NextRequest, NextResponse } from "next/server"
import { requerAdmin } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const subcategoriaSchema = z.object({
  nome: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  ativa: z.boolean().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requerAdmin()
    const body = await request.json()
    const data = subcategoriaSchema.parse(body)

    const subcategoria = await prisma.subcategoria.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json(subcategoria)
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ erro: error.errors }, { status: 400 })
    }
    return NextResponse.json({ erro: "Erro ao atualizar subcategoria" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requerAdmin()
    await prisma.subcategoria.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ sucesso: true })
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    return NextResponse.json({ erro: "Erro ao deletar subcategoria" }, { status: 500 })
  }
}

