"use client"
import "@rainbow-me/rainbowkit/styles.css"
import { State, WagmiProvider } from "wagmi"
import {
  darkTheme,
  RainbowKitProvider as NextRainbowKitProvider,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit"
import { ReactNode } from "react"
import wagmiConfig from "@/lib/config/wagmi"
import { authenticationAdapter } from "@/lib/utils/authenticationAdapter"
import { ReactQueryProvider } from "./ReactQueryProvider"

type RainbowKitProviderProps = {
  children: ReactNode
  initialState: State | undefined
  isAuth: boolean
}

export const RainbowKitProvider = ({
  children,
  initialState,
  isAuth,
}: RainbowKitProviderProps) => {
  const status = isAuth ? "authenticated" : "unauthenticated"

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <ReactQueryProvider>
        <RainbowKitAuthenticationProvider
          adapter={authenticationAdapter}
          status={status}
        >
          <NextRainbowKitProvider
            coolMode
            theme={darkTheme()}
            appInfo={{
              appName: "QuillShield AVS",
            }}
          >
            {children}
          </NextRainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </ReactQueryProvider>
    </WagmiProvider>
  )
}
