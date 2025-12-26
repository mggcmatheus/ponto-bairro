import { NextRequest, NextResponse } from "next/server"
import { requerAdmin } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requerAdmin()
    const estande = await prisma.estande.findUnique({
      where: { id: params.id },
    })

    if (!estande) {
      return NextResponse.json({ erro: "Estande não encontrado" }, { status: 404 })
    }

    const estandeAtualizado = await prisma.estande.update({
      where: { id: params.id },
      data: { ativo: !estande.ativo },
    })

    return NextResponse.json(estandeAtualizado)
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    return NextResponse.json({ erro: "Erro ao atualizar estande" }, { status: 500 })
  }
}

