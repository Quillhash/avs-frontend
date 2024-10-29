import { NextUIProvider } from "./NextUIProvider"
import { RainbowKitProvider } from "./RainbowKitProvider"
import { headers } from "next/headers"
import { cookieToInitialState } from "wagmi"
import wagmiConfig from "@/lib/config/wagmi"
import { ReactNode } from "react"
import { isAuthAction } from "@/lib/actions/auth"

export const Providers = async ({ children }: { children: ReactNode }) => {
  const { isAuth } = await isAuthAction()
  const headersStore = await headers()
  const cookie = headersStore.get("cookie")
  const initialState = cookieToInitialState(wagmiConfig, cookie)

  return (
    <NextUIProvider>
      <RainbowKitProvider initialState={initialState} isAuth={isAuth}>
        {children}
      </RainbowKitProvider>
    </NextUIProvider>
  )
}
