"use client"
import { NextUIProvider as NUIProvider } from "@nextui-org/react"
import { ReactNode } from "react"
import { Toaster } from "sonner"

export const NextUIProvider = ({ children }: { children: ReactNode }) => {
  return (
    <NUIProvider>
      <Toaster richColors invert position="top-right" />
      {children}
    </NUIProvider>
  )
}
