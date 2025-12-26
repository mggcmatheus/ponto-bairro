import { NextRequest, NextResponse } from "next/server"
import { requerAdmin } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

export const dynamic = 'force-dynamic'

const usuarioSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  senha: z.string().min(6),
  tipo: z.enum(["ADMIN", "ANUNCIANTE"]),
  ativo: z.boolean().optional(),
})

export async function GET() {
  try {
    await requerAdmin()
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        ativo: true,
        criado_em: true,
      },
      orderBy: { criado_em: "desc" },
    })
    return NextResponse.json(usuarios)
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    return NextResponse.json({ erro: "Erro ao buscar usuários" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requerAdmin()
    const body = await request.json()
    const data = usuarioSchema.parse(body)

    const senha_hash = await bcrypt.hash(data.senha, 10)

    const usuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha_hash,
        tipo: data.tipo,
        ativo: data.ativo ?? true,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        ativo: true,
        criado_em: true,
      },
    })

    return NextResponse.json(usuario, { status: 201 })
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ erro: error.errors }, { status: 400 })
    }
    if (error.code === "P2002") {
      return NextResponse.json({ erro: "Email já cadastrado" }, { status: 400 })
    }
    return NextResponse.json({ erro: "Erro ao criar usuário" }, { status: 500 })
  }
}

