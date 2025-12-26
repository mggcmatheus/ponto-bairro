"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface Usuario {
  id: string
  nome: string
  email: string
  tipo: "ADMIN" | "ANUNCIANTE"
  ativo: boolean
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "ANUNCIANTE" as "ADMIN" | "ANUNCIANTE",
    ativo: true,
  })

  useEffect(() => {
    carregarUsuarios()
  }, [])

  async function carregarUsuarios() {
    const res = await fetch("/api/admin/usuarios")
    if (res.ok) {
      const data = await res.json()
      setUsuarios(data)
    }
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    const url = editando
      ? `/api/admin/usuarios/${editando.id}`
      : "/api/admin/usuarios"
    const method = editando ? "PUT" : "POST"

    const body: any = { ...formData }
    if (editando && !body.senha) {
      delete body.senha
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setMostrarForm(false)
      setEditando(null)
      setFormData({ nome: "", email: "", senha: "", tipo: "ANUNCIANTE", ativo: true })
      carregarUsuarios()
    }
  }

  function editar(usuario: Usuario) {
    setEditando(usuario)
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: "",
      tipo: usuario.tipo,
      ativo: usuario.ativo,
    })
    setMostrarForm(true)
  }

  async function deletar(id: string) {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return

    const res = await fetch(`/api/admin/usuarios/${id}`, { method: "DELETE" })
    if (res.ok) {
      carregarUsuarios()
    }
  }

  return (
    <div className="min-h-screen pt-16 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Usuários</h1>
          <div className="flex gap-2">
            <Link href="/admin/dashboard">
              <Button variant="outline">Voltar</Button>
            </Link>
            <Button
              onClick={() => {
                setEditando(null)
                setFormData({ nome: "", email: "", senha: "", tipo: "ANUNCIANTE", ativo: true })
                setMostrarForm(true)
              }}
            >
              Novo Usuário
            </Button>
          </div>
        </div>

        {mostrarForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              {editando ? "Editar Usuário" : "Novo Usuário"}
            </h2>
            <form onSubmit={salvar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Senha {editando && "(deixe em branco para não alterar)"}
                </label>
                <Input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  required={!editando}
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as "ADMIN" | "ANUNCIANTE" })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="ANUNCIANTE">Anunciante</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="ativo" className="text-sm">Ativo</label>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usuarios.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.tipo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${user.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {user.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editar(user)}>
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deletar(user.id)}>
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

