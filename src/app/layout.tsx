import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/Providers"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

export const metadata: Metadata = {
  title: "QuillShield AVS",
  description: "QuillShield AVS",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
