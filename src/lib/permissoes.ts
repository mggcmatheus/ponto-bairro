import { auth } from "./auth"
import { redirect } from "next/navigation"

export type TipoUsuario = "ADMIN" | "ANUNCIANTE"

export async function getUsuarioAtual() {
  const session = await auth()
  return session?.user
}

export async function requerAutenticacao() {
  const usuario = await getUsuarioAtual()
  if (!usuario) {
    redirect("/login")
  }
  return usuario
}

export async function requerAdmin() {
  const usuario = await requerAutenticacao()
  if (usuario.tipo !== "ADMIN") {
    redirect("/")
  }
  return usuario
}

export async function requerAnunciante() {
  const usuario = await requerAutenticacao()
  if (usuario.tipo !== "ANUNCIANTE") {
    redirect("/")
  }
  return usuario
}

export function podeEditarEstande(usuario: { id: string; tipo: TipoUsuario }, estandeUsuarioId: string) {
  return usuario.tipo === "ADMIN" || usuario.id === estandeUsuarioId
}

