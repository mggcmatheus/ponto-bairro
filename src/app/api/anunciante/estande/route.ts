import { NextRequest, NextResponse } from "next/server"
import { requerAnunciante, getUsuarioAtual } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const estandeSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().max(500),
  categoriaId: z.string().uuid(),
  subcategoriaId: z.string().uuid().optional().nullable(),
  latitude: z.number(),
  longitude: z.number(),
})

export async function GET() {
  try {
    const usuario = await requerAnunciante()
    const estande = await prisma.estande.findFirst({
      where: { usuarioId: usuario.id },
      include: {
        categoria: true,
        subcategoria: true,
        imagens: {
          orderBy: { ordem: "asc" },
        },
      },
    })

    if (!estande) {
      return NextResponse.json(null)
    }

    // Converter dados binários para base64
    const estandeComImagens = {
      ...estande,
      imagens: estande.imagens.map((img) => ({
        ...img,
        dados: Buffer.from(img.dados).toString("base64"),
      })),
    }

    return NextResponse.json(estandeComImagens)
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    return NextResponse.json({ erro: "Erro ao buscar estande" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const usuario = await requerAnunciante()
    const body = await request.json()
    const data = estandeSchema.parse(body)

    // Verificar se já existe um estande
    const estandeExistente = await prisma.estande.findFirst({
      where: { usuarioId: usuario.id },
    })

    if (estandeExistente) {
      return NextResponse.json(
        { erro: "Você já possui um estande cadastrado" },
        { status: 400 }
      )
    }

    const estande = await prisma.estande.create({
      data: {
        usuarioId: usuario.id,
        nome: data.nome,
        descricao: data.descricao,
        categoriaId: data.categoriaId,
        subcategoriaId: data.subcategoriaId || null,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    })

    return NextResponse.json(estande, { status: 201 })
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ erro: error.errors }, { status: 400 })
    }
    return NextResponse.json({ erro: "Erro ao criar estande" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const usuario = await requerAnunciante()
    const body = await request.json()
    const data = estandeSchema.parse(body)

    const estande = await prisma.estande.findFirst({
      where: { usuarioId: usuario.id },
    })

    if (!estande) {
      return NextResponse.json(
        { erro: "Estande não encontrado" },
        { status: 404 }
      )
    }

    const estandeAtualizado = await prisma.estande.update({
      where: { id: estande.id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        categoriaId: data.categoriaId,
        subcategoriaId: data.subcategoriaId || null,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    })

    return NextResponse.json(estandeAtualizado)
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ erro: error.errors }, { status: 400 })
    }
    return NextResponse.json({ erro: "Erro ao atualizar estande" }, { status: 500 })
  }
}

