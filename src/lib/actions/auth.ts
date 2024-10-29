"use server"
import { cookies } from "next/headers"
import { COOKIE_KEYS } from "../constants"
import { verifyJwt } from "../utils/verifyJWT"

export async function signInAction({ jwt }: { jwt: string }) {
  ;(await cookies()).set(COOKIE_KEYS.JWT, jwt, { secure: true })
}

export async function signOutAction() {
  ;(await cookies()).delete(COOKIE_KEYS.JWT)
}

export async function isAuthAction() {
  try {
    const jwt = (await cookies()).get(COOKIE_KEYS.JWT)?.value

    if (!jwt) return { isAuth: false }

    const payload = await verifyJwt(jwt)

    return { isAuth: Boolean(payload.address) }
  } catch {
    return { isAuth: false }
  }
}
