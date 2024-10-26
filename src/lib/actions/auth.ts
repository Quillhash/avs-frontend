"use server"
import { cookies } from "next/headers"
import { COOKIE_KEYS } from "../constants"
import { verifyJwt } from "../utils/verifyJWT"
import { createClient } from "../supabase/server"

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

    const supabase = await createClient()
    const users = await supabase
      .from("users_metadata")
      .select("*")
      .eq("address", payload.address as string)

    return { isAuth: Boolean(users?.data?.[0]?.id) }
  } catch {
    return { isAuth: false }
  }
}
