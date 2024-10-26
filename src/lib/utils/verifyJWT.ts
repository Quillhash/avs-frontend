import { jwtVerify } from "jose"
import { env } from "../config/env"

export const verifyJwt = async (token: string) => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(env.JWT_SECRET_KEY)
    )
    return payload
  } catch (error) {
    throw new Error("Invalid token")
  }
}
