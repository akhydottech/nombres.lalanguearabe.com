import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Apprendre les Nombres Arabes",
  description: "Une application interactive pour apprendre les nombres arabes et leurs translittérations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className="min-h-screen bg-background">{children}</main>
          <footer className="border-t py-4 w-full">
            <div className="container flex justify-center">
              <a 
                href="https://github.com/akhydottech/nombres.lalanguearabe.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <GitHubLogoIcon className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </div>
          </footer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
