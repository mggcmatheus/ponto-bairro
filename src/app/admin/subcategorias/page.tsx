"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface Subcategoria {
  id: string
  nome: string
  slug: string
  ativa: boolean
  categoria: { nome: string }
  categoriaId: string
}

interface Categoria {
  id: string
  nome: string
}

export default function SubcategoriasPage() {
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState<Subcategoria | null>(null)
  const [formData, setFormData] = useState({
    categoriaId: "",
    nome: "",
    slug: "",
    ativa: true,
  })

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    const [resSub, resCat] = await Promise.all([
      fetch("/api/admin/subcategorias"),
      fetch("/api/admin/categorias"),
    ])
    if (resSub.ok) {
      const data = await resSub.json()
      setSubcategorias(data)
    }
    if (resCat.ok) {
      const data = await resCat.json()
      setCategorias(data)
    }
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    const url = editando
      ? `/api/admin/subcategorias/${editando.id}`
      : "/api/admin/subcategorias"
    const method = editando ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setMostrarForm(false)
      setEditando(null)
      setFormData({ categoriaId: "", nome: "", slug: "", ativa: true })
      carregarDados()
    }
  }

  function editar(subcategoria: Subcategoria) {
    setEditando(subcategoria)
    setFormData({
      categoriaId: subcategoria.categoriaId,
      nome: subcategoria.nome,
      slug: subcategoria.slug,
      ativa: subcategoria.ativa,
    })
    setMostrarForm(true)
  }

  async function deletar(id: string) {
    if (!confirm("Tem certeza que deseja deletar esta subcategoria?")) return

    const res = await fetch(`/api/admin/subcategorias/${id}`, { method: "DELETE" })
    if (res.ok) {
      carregarDados()
    }
  }

  return (
    <div className="min-h-screen pt-16 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Subcategorias</h1>
          <div className="flex gap-2">
            <Link href="/admin/dashboard">
              <Button variant="outline">Voltar</Button>
            </Link>
            <Button
              onClick={() => {
                setEditando(null)
                setFormData({ categoriaId: "", nome: "", slug: "", ativa: true })
                setMostrarForm(true)
              }}
            >
              Nova Subcategoria
            </Button>
          </div>
        </div>

        {mostrarForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              {editando ? "Editar Subcategoria" : "Nova Subcategoria"}
            </h2>
            <form onSubmit={salvar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <select
                  value={formData.categoriaId}
                  onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={!!editando}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ativa"
                  checked={formData.ativa}
                  onChange={(e) => setFormData({ ...formData, ativa: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="ativa" className="text-sm">Ativa</label>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Salvar</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setMostrarForm(false)
                    setEditando(null)
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subcategorias.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{sub.categoria.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sub.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sub.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${sub.ativa ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {sub.ativa ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editar(sub)}>
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deletar(sub.id)}>
                        Deletar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

