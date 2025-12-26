"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"

const MapaEditor = dynamic(() => import("@/components/MapaEditor").then(mod => ({ default: mod.MapaEditor })), { ssr: false })

interface Estande {
  id: string
  nome: string
  descricao: string
  categoriaId: string
  subcategoriaId: string | null
  latitude: number
  longitude: number
  ativo: boolean
  imagens: Array<{ id: string; mime_type: string; dados: string }>
}

interface Categoria {
  id: string
  nome: string
  ativa: boolean
  subcategorias: Array<{ id: string; nome: string; ativa: boolean }>
}

export default function AnuncianteDashboard() {
  const [estande, setEstande] = useState<Estande | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoriaId: "",
    subcategoriaId: "",
    latitude: -13.79374,
    longitude: -56.08164,
  })
  const [imagemArquivo, setImagemArquivo] = useState<File | null>(null)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      const [resEstande, resCategorias] = await Promise.all([
        fetch("/api/anunciante/estande"),
        fetch("/api/categorias"),
      ])

      if (resEstande.ok) {
        const estandeData = await resEstande.json()
        if (estandeData) {
          setEstande(estandeData)
          setFormData({
            nome: estandeData.nome,
            descricao: estandeData.descricao,
            categoriaId: estandeData.categoriaId,
            subcategoriaId: estandeData.subcategoriaId || "",
            latitude: estandeData.latitude,
            longitude: estandeData.longitude,
          })
        }
      }

      if (resCategorias.ok) {
        const categoriasData = await resCategorias.json()
        setCategorias(categoriasData)
      }
    } finally {
      setCarregando(false)
    }
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)

    try {
      const url = "/api/anunciante/estande"
      const method = estande ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subcategoriaId: formData.subcategoriaId || null,
        }),
      })

      const estandeData = await res.json()
      
      if (res.ok) {
        setEstande(estandeData)

        // Upload da imagem se houver
        if (imagemArquivo && estandeData.id) {
          const formDataImg = new FormData()
          formDataImg.append("arquivo", imagemArquivo)
          formDataImg.append("estandeId", estandeData.id)

          await fetch("/api/anunciante/estande/imagem", {
            method: "POST",
            body: formDataImg,
          })
        }

        setImagemArquivo(null)
        alert("Estande salvo com sucesso!")
        carregarDados()
      } else {
        alert(`Erro: ${estandeData.erro || "Erro ao salvar estande"}`)
      }
    } catch (error) {
      alert("Erro ao salvar estande")
    } finally {
      setSalvando(false)
    }
  }

  const categoriaSelecionada = categorias.find((c) => c.id === formData.categoriaId)
  const imagemUrl = estande?.imagens && estande.imagens.length > 0
    ? `data:${estande.imagens[0].mime_type};base64,${estande.imagens[0].dados}`
    : null

  if (carregando) {
    return (
      <div className="min-h-screen pt-16 p-8 flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Meu Estande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              {estande ? "Editar Estande" : "Criar Estande"}
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
                <label className="block text-sm font-medium mb-1">
                  Descrição (máx 500 caracteres)
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  maxLength={500}
                  required
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  rows={4}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.descricao.length}/500
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <select
                  value={formData.categoriaId}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      categoriaId: e.target.value,
                      subcategoriaId: "",
                    })
                  }}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias
                    .filter((c) => c.ativa)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                </select>
              </div>
              {categoriaSelecionada && categoriaSelecionada.subcategorias.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-1">Subcategoria (opcional)</label>
                  <select
                    value={formData.subcategoriaId}
                    onChange={(e) => setFormData({ ...formData, subcategoriaId: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Nenhuma</option>
                    {categoriaSelecionada.subcategorias
                      .filter((s) => s.ativa)
                      .map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.nome}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Imagem de Capa</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagemArquivo(e.target.files?.[0] || null)}
                />
                {imagemUrl && !imagemArquivo && (
                  <div className="mt-2 w-full h-48 relative rounded-md overflow-hidden">
                    <Image
                      src={imagemUrl}
                      alt="Imagem atual"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Localização (arraste o pin no mapa)
                </label>
                <div className="text-xs text-gray-500 mb-2">
                  Latitude: {formData.latitude.toFixed(6)}, Longitude: {formData.longitude.toFixed(6)}
                </div>
              </div>
              <Button type="submit" disabled={salvando} className="w-full">
                {salvando ? "Salvando..." : estande ? "Atualizar" : "Criar"}
              </Button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Selecione a Localização</h2>
            <div className="h-[500px] rounded-md overflow-hidden border border-gray-200">
              <MapaEditor
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationChange={(lat, lng) => {
                  setFormData({ ...formData, latitude: lat, longitude: lng })
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

