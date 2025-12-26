import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Topbar } from "@/components/Topbar"
import { SessionProvider } from "@/components/SessionProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PontoBairro",
  description: "Plataforma hiperlocal de anúncios de serviços, comércios e produtos do bairro",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SessionProvider>
          <Topbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}

