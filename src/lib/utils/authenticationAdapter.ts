import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit"
import { signInAction, signOutAction } from "../actions/auth"
import { eventEmitter } from "../config/eventEmitter"
import { EMITTER_EVENTS } from "../constants"
import { createSiweMessage } from "viem/siwe"

export const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    const response = await fetch("/api/nonce")
    const data: { nonce: string } = await response.json()

    return new Promise((resolve) => resolve(data.nonce))
  },
  createMessage: ({ nonce, address, chainId }) => {
    return createSiweMessage({
      domain: window.location.host,
      uri: window.location.origin,
      address,
      statement: "Sign in with Ethereum to the app.",
      version: "1",
      chainId,
      nonce,
    })
  },
  verify: async ({ message, signature }) => {
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, signature }),
    })

    if (!response.ok) {
      throw new Error("Failed to verify signature")
    }
    const data = await response.json()

    await signInAction({ jwt: data.jwt })

    eventEmitter.emit(EMITTER_EVENTS.SIGN_IN)

    return true
  },
  signOut: async () => {
    await fetch("/api/logout")
    await signOutAction()
    eventEmitter.emit(EMITTER_EVENTS.SIGN_OUT)
  },
})
