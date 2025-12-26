import { requerAdmin } from "@/lib/permissoes"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
  await requerAdmin()

  return (
    <div className="min-h-screen pt-16 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/categorias">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Categorias</h2>
              <p className="text-gray-600 text-sm">Gerenciar categorias</p>
            </div>
          </Link>

          <Link href="/admin/subcategorias">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Subcategorias</h2>
              <p className="text-gray-600 text-sm">Gerenciar subcategorias</p>
            </div>
          </Link>

          <Link href="/admin/usuarios">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Usuários</h2>
              <p className="text-gray-600 text-sm">Gerenciar usuários</p>
            </div>
          </Link>

          <Link href="/admin/estandes">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Estandes</h2>
              <p className="text-gray-600 text-sm">Gerenciar estandes</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

