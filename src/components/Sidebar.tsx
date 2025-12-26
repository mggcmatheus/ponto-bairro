"use client"

import { useState, useEffect } from "react"
import { Input } from "./ui/input"

interface Categoria {
  id: string
  nome: string
  slug: string
  subcategorias: Subcategoria[]
}

interface Subcategoria {
  id: string
  nome: string
  slug: string
}

interface SidebarProps {
  onFiltroChange: (filtros: { pesquisa: string; categoriaId?: string; subcategoriaId?: string }) => void
}

export function Sidebar({ onFiltroChange }: SidebarProps) {
  const [pesquisa, setPesquisa] = useState("")
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaAberta, setCategoriaAberta] = useState<string | null>(null)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | undefined>()
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState<string | undefined>()

  useEffect(() => {
    async function carregarCategorias() {
      const res = await fetch("/api/categorias")
      if (res.ok) {
        const data = await res.json()
        setCategorias(data)
      }
    }
    carregarCategorias()
  }, [])

  useEffect(() => {
    onFiltroChange({
      pesquisa,
      categoriaId: categoriaSelecionada,
      subcategoriaId: subcategoriaSelecionada,
    })
  }, [pesquisa, categoriaSelecionada, subcategoriaSelecionada, onFiltroChange])

  const toggleCategoria = (categoriaId: string) => {
    setCategoriaAberta(categoriaId === categoriaAberta ? null : categoriaId)
  }

  const selecionarCategoria = (categoriaId: string) => {
    setCategoriaSelecionada(categoriaId === categoriaSelecionada ? undefined : categoriaId)
    setSubcategoriaSelecionada(undefined)
  }

  const selecionarSubcategoria = (subcategoriaId: string) => {
    setSubcategoriaSelecionada(subcategoriaId === subcategoriaSelecionada ? undefined : subcategoriaId)
  }

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-40">
      <div className="p-4 space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Pesquisar..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Categorias</h2>
          <div className="space-y-1">
            {categorias
              .filter((cat) => cat.ativa)
              .map((categoria) => (
                <div key={categoria.id}>
                  <button
                    onClick={() => {
                      toggleCategoria(categoria.id)
                      selecionarCategoria(categoria.id)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 flex items-center justify-between ${
                      categoriaSelecionada === categoria.id ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    <span>{categoria.nome}</span>
                    {categoria.subcategorias.length > 0 && (
                      <span className="text-xs text-gray-500">
                        {categoriaAberta === categoria.id ? "−" : "+"}
                      </span>
                    )}
                  </button>
                  {categoriaAberta === categoria.id && categoria.subcategorias.length > 0 && (
                    <div className="ml-4 mt-1 space-y-1">
                      {categoria.subcategorias
                        .filter((sub) => sub.ativa)
                        .map((subcategoria) => (
                          <button
                            key={subcategoria.id}
                            onClick={() => selecionarSubcategoria(subcategoria.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-xs hover:bg-gray-50 ${
                              subcategoriaSelecionada === subcategoria.id
                                ? "bg-gray-50 font-medium"
                                : ""
                            }`}
                          >
                            {subcategoria.nome}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

