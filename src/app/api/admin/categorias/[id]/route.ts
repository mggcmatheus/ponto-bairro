import { NextRequest, NextResponse } from "next/server"
import { requerAdmin } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export const dynamic = 'force-dynamic'

const categoriaSchema = z.object({
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
    const data = categoriaSchema.parse(body)

    const categoria = await prisma.categoria.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json(categoria)
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ erro: error.errors }, { status: 400 })
    }
    return NextResponse.json({ erro: "Erro ao atualizar categoria" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requerAdmin()
    await prisma.categoria.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ sucesso: true })
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    return NextResponse.json({ erro: "Erro ao deletar categoria" }, { status: 500 })
  }
}

