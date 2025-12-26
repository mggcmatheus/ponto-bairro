import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pesquisa = searchParams.get("pesquisa") || ""
    const categoriaId = searchParams.get("categoriaId")
    const subcategoriaId = searchParams.get("subcategoriaId")

    const where: any = {
      ativo: true,
    }

    if (categoriaId) {
      where.categoriaId = categoriaId
    }

    if (subcategoriaId) {
      where.subcategoriaId = subcategoriaId
    }

    if (pesquisa) {
      where.OR = [
        { nome: { contains: pesquisa, mode: "insensitive" } },
        { descricao: { contains: pesquisa, mode: "insensitive" } },
      ]
    }

    const estandes = await prisma.estande.findMany({
      where,
      include: {
        categoria: {
          select: { nome: true },
        },
        subcategoria: {
          select: { nome: true },
        },
        imagens: {
          orderBy: { ordem: "asc" },
          take: 1,
          select: {
            id: true,
            mime_type: true,
            dados: true,
          },
        },
      },
    })

    // Converter dados binários para base64
    const estandesComImagens = estandes.map((estande) => {
      const imagensConvertidas = estande.imagens.map((img) => {
        try {
          // Se dados já é uma string (base64), retornar como está
          // Se é um Buffer, converter para base64
          const dadosBase64 = typeof img.dados === 'string' 
            ? img.dados 
            : Buffer.from(img.dados).toString("base64")
          return {
            ...img,
            dados: dadosBase64,
          }
        } catch (error) {
          console.error("Erro ao converter imagem:", error)
          return {
            ...img,
            dados: "",
          }
        }
      })
      
      return {
        ...estande,
        imagens: imagensConvertidas,
      }
    })

    return NextResponse.json(estandesComImagens)
  } catch (error) {
    console.error("Erro ao buscar estandes:", error)
    return NextResponse.json(
      { erro: "Erro ao buscar estandes" },
      { status: 500 }
    )
  }
}

