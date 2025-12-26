import { NextRequest, NextResponse } from "next/server"
import { requerAnunciante } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const usuario = await requerAnunciante()
    const formData = await request.formData()
    const arquivo = formData.get("arquivo") as File
    const estandeId = formData.get("estandeId") as string

    if (!arquivo || !estandeId) {
      return NextResponse.json(
        { erro: "Arquivo e estandeId são obrigatórios" },
        { status: 400 }
      )
    }

    // Verificar se o estande pertence ao usuário
    const estande = await prisma.estande.findFirst({
      where: {
        id: estandeId,
        usuarioId: usuario.id,
      },
    })

    if (!estande) {
      return NextResponse.json(
        { erro: "Estande não encontrado" },
        { status: 404 }
      )
    }

    // Converter arquivo para buffer
    const bytes = await arquivo.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Deletar imagens antigas
    await prisma.imagemEstande.deleteMany({
      where: { estandeId },
    })

    // Criar nova imagem
    const imagem = await prisma.imagemEstande.create({
      data: {
        estandeId,
        mime_type: arquivo.type,
        dados: buffer,
        ordem: 0,
      },
    })

    return NextResponse.json({ sucesso: true, imagemId: imagem.id })
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error
    return NextResponse.json({ erro: "Erro ao fazer upload da imagem" }, { status: 500 })
  }
}

