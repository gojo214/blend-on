import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs"
import { shadcn } from "@clerk/ui/themes"
import { Geist, Geist_Mono } from "next/font/google"

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
        geist.variable
      )}
    >
      <body>
        <ClerkProvider
          appearance={{ theme: shadcn }}
          taskUrls={{ "choose-organization": "/choose-organisation" }}
        >
          <ThemeProvider>
            <div className="flex min-h-svh flex-col">
              <header className="flex items-center justify-between border-b border-border px-6 py-4">
                <div className="text-lg font-semibold">Blend On</div>
                <div className="flex items-center gap-4">
                  <Show when="signed-out">
                    <SignInButton mode="modal">
                      <Button variant="outline" size="sm">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="sm">Sign Up</Button>
                    </SignUpButton>
                  </Show>
                  <Show when="signed-in">
                    <UserButton />
                  </Show>
                </div>
              </header>
              <main className="flex-1">{children}</main>
            </div>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
