"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix para ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

interface Estande {
  id: string
  nome: string
  descricao: string
  latitude: number
  longitude: number
  ativo: boolean
  categoria: { nome: string }
  subcategoria: { nome: string } | null
  imagens: Array<{ id: string; mime_type: string; dados: string }>
}

interface MapaProps {
  filtros: { pesquisa: string; categoriaId?: string; subcategoriaId?: string }
  onEstandeClick?: (estande: Estande) => void
}

function AtualizarMapa({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [map, center])
  return null
}

export function Mapa({ filtros, onEstandeClick }: MapaProps) {
  const [estandes, setEstandes] = useState<Estande[]>([])
  const [estandeSelecionado, setEstandeSelecionado] = useState<Estande | null>(null)
  const [center, setCenter] = useState<[number, number]>([-13.79374, -56.08164])

  useEffect(() => {
    async function carregarEstandes() {
      const params = new URLSearchParams()
      if (filtros.pesquisa) params.append("pesquisa", filtros.pesquisa)
      if (filtros.categoriaId) params.append("categoriaId", filtros.categoriaId)
      if (filtros.subcategoriaId) params.append("subcategoriaId", filtros.subcategoriaId)

      const res = await fetch(`/api/estandes?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setEstandes(data)
      }
    }
    carregarEstandes()
  }, [filtros])

  const handleMarkerClick = (estande: Estande) => {
    setEstandeSelecionado(estande)
    if (onEstandeClick) {
      onEstandeClick(estande)
    }
  }

  const imagemCapa = estandeSelecionado?.imagens && estandeSelecionado.imagens.length > 0
    ? estandeSelecionado.imagens[0]
    : null
  const imagemUrl = imagemCapa && imagemCapa.dados && imagemCapa.mime_type
    ? `data:${imagemCapa.mime_type};base64,${imagemCapa.dados}`
    : null

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {estandes
          .filter((e) => e.ativo)
          .map((estande) => {
            const imagemPopup = estande.imagens && estande.imagens.length > 0
              ? estande.imagens[0]
              : null
            const imagemUrlPopup = imagemPopup && imagemPopup.dados && imagemPopup.mime_type
              ? `data:${imagemPopup.mime_type};base64,${imagemPopup.dados}`
              : null

            return (
              <Marker
                key={estande.id}
                position={[estande.latitude, estande.longitude]}
                eventHandlers={{
                  click: () => handleMarkerClick(estande),
                }}
              >
                <Popup>
                  <div className="text-sm" style={{ minWidth: "200px" }}>
                    {imagemUrlPopup && (
                      <Image
                        src={imagemUrlPopup}
                        alt={estande.nome}
                        width={200}
                        height={128}
                        className="w-full h-32 object-cover rounded mb-2"
                        style={{ maxWidth: "200px" }}
                        unoptimized
                      />
                    )}
                    <strong>{estande.nome}</strong>
                    <p className="text-xs text-gray-600 mt-1">{estande.categoria.nome}</p>
                    {estande.subcategoria && (
                      <p className="text-xs text-gray-500">{estande.subcategoria.nome}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          })}
      </MapContainer>

      {estandeSelecionado && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md border border-gray-200 z-50">
          <button
            onClick={() => setEstandeSelecionado(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold w-6 h-6 flex items-center justify-center"
          >
            ×
          </button>
          {imagemUrl ? (
            <div className="w-full h-48 mb-3 rounded-md overflow-hidden relative">
              <Image
                src={imagemUrl}
                alt={estandeSelecionado.nome}
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  console.error("Erro ao carregar imagem")
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-md mb-3 flex items-center justify-center text-gray-400 text-sm">
              Sem imagem
            </div>
          )}
          <h3 className="font-semibold text-lg mb-1">{estandeSelecionado.nome}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {estandeSelecionado.categoria.nome}
            {estandeSelecionado.subcategoria && ` • ${estandeSelecionado.subcategoria.nome}`}
          </p>
          <p className="text-sm text-gray-700">{estandeSelecionado.descricao}</p>
          <p className="text-xs text-gray-500 mt-2">
            📍 {estandeSelecionado.latitude.toFixed(6)}, {estandeSelecionado.longitude.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  )
}

