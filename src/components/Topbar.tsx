"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import Link from "next/link"

export function Topbar() {
  const { data: session } = useSession()

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-6">
      <Link href="/" className="text-xl font-bold text-gray-900">
        PontoBairro
      </Link>
      
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-sm text-gray-700">
              {session.user.nome}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sair
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="default" size="sm">
              Entrar
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}

