import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      nome: string
      tipo: "ADMIN" | "ANUNCIANTE"
    }
  }

  interface User {
    id: string
    email: string
    nome: string
    tipo: "ADMIN" | "ANUNCIANTE"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    tipo: "ADMIN" | "ANUNCIANTE"
    nome: string
  }
}

