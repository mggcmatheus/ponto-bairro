import { NextRequest, NextResponse } from "next/server"
import { requerAdmin } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    await requerAdmin()
    const estandes = await prisma.estande.findMany({
      include: {
        usuario: {
          select: { nome: true, email: true },
        },
        categoria: {
          select: { nome: true },
        },
        subcategoria: {
          select: { nome: true },
        },
      },
      orderBy: { criado_em: "desc" },
    })
    return NextResponse.json(estandes)
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    return NextResponse.json({ erro: "Erro ao buscar estandes" }, { status: 500 })
  }
}

