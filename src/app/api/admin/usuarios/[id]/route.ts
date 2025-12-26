import { NextRequest, NextResponse } from "next/server"
import { requerAdmin } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const usuarioSchema = z.object({
  nome: z.string().min(1).optional(),
  email: z.string().email().optional(),
  senha: z.string().min(6).optional(),
  tipo: z.enum(["ADMIN", "ANUNCIANTE"]).optional(),
  ativo: z.boolean().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requerAdmin()
    const body = await request.json()
    const data = usuarioSchema.parse(body)

    const updateData: any = { ...data }
    if (data.senha) {
      updateData.senha_hash = await bcrypt.hash(data.senha, 10)
      delete updateData.senha
    }

    const usuario = await prisma.usuario.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        ativo: true,
        criado_em: true,
      },
    })

    return NextResponse.json(usuario)
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ erro: error.errors }, { status: 400 })
    }
    return NextResponse.json({ erro: "Erro ao atualizar usuário" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requerAdmin()
    await prisma.usuario.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ sucesso: true })
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    return NextResponse.json({ erro: "Erro ao deletar usuário" }, { status: 500 })
  }
}

