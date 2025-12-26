"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Estande {
  id: string
  nome: string
  descricao: string
  ativo: boolean
  usuario: { nome: string; email: string }
  categoria: { nome: string }
  subcategoria: { nome: string } | null
}

export default function EstandesPage() {
  const [estandes, setEstandes] = useState<Estande[]>([])

  useEffect(() => {
    carregarEstandes()
  }, [])

  async function carregarEstandes() {
    const res = await fetch("/api/admin/estandes")
    if (res.ok) {
      const data = await res.json()
      setEstandes(data)
    }
  }

  async function toggleAtivo(id: string) {
    const res = await fetch(`/api/admin/estandes/${id}/toggle`, { method: "PATCH" })
    if (res.ok) {
      carregarEstandes()
    }
  }

  return (
    <div className="min-h-screen pt-16 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Estandes</h1>
          <Link href="/admin/dashboard">
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anunciante</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {estandes.map((estande) => (
                <tr key={estande.id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{estande.nome}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {estande.descricao}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium">{estande.usuario.nome}</div>
                      <div className="text-xs text-gray-500">{estande.usuario.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {estande.categoria.nome}
                    {estande.subcategoria && ` • ${estande.subcategoria.nome}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${estande.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {estande.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant={estande.ativo ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleAtivo(estande.id)}
                    >
                      {estande.ativo ? "Desativar" : "Ativar"}
                    </Button>
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

