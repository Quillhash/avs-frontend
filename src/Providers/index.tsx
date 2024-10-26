import { NextUIProvider } from "./NextUIProvider"
import { RainbowKitProvider } from "./RainbowKitProvider"
import { headers } from "next/headers"
import { cookieToInitialState } from "wagmi"
import wagmiConfig from "@/lib/config/wagmi"
import { ReactNode } from "react"

export const Providers = async ({ children }: { children: ReactNode }) => {
  const headersStore = await headers()
  const cookie = headersStore.get("cookie")

  const initialState = cookieToInitialState(wagmiConfig, cookie)

  return (
    <NextUIProvider>
      <RainbowKitProvider initialState={initialState}>
        {children}
      </RainbowKitProvider>
    </NextUIProvider>
  )
}
