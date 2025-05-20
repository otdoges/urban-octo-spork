import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import Navbar from "@/components/navbar"
import { ClerkProvider } from "@clerk/nextjs"
import { ConvexProvider } from "../providers/convex-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Website to SiteConfig Converter",
  description: "Convert any website into a customizable template",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ConvexProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Toaster position="bottom-right" />
              </div>
            </ConvexProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
