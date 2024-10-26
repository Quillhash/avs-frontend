"use client"
import { NextUIProvider as NUIProvider } from "@nextui-org/react"
import { ReactNode } from "react"

export const NextUIProvider = ({ children }: { children: ReactNode }) => {
  return <NUIProvider>{children}</NUIProvider>
}
