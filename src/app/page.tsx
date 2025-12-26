"use client"

import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import dynamic from "next/dynamic"

const Mapa = dynamic(() => import("@/components/Mapa").then(mod => ({ default: mod.Mapa })), { ssr: false })

export default function HomePage() {
  const [filtros, setFiltros] = useState<{
    pesquisa: string
    categoriaId?: string
    subcategoriaId?: string
  }>({
    pesquisa: "",
  })

  return (
    <div className="flex h-screen pt-16">
      <Sidebar onFiltroChange={setFiltros} />
      <main className="flex-1 ml-64">
        <Mapa filtros={filtros} />
      </main>
    </div>
  )
}

