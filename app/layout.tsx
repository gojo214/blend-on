import {
  ClerkProvider
} from "@clerk/nextjs"
import { shadcn } from "@clerk/ui/themes"
import { Fraunces, Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const fontLogo = Fraunces({
  subsets: ["latin"],
  variable: "--font-logo",
})

export const metadata: Metadata = {
  title: {
    default: "Buildon — Build 3D games with AI",
    template: "%s · Buildon",
  },
  description:
    "Describe a game and watch it come to life. Buildon is an agentic three.js game builder that plans the scene, writes the code, and streams playable worlds from plain English.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
         "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
        fontLogo.variable
      )}
    >
      <body>
        <ClerkProvider
          appearance={{ theme: shadcn }}
          taskUrls={{ "choose-organization": "/choose-organisation" }}
        >
          <ThemeProvider>
             {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
