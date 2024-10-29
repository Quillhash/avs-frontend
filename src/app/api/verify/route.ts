import { IRON_OPTIONS } from "@/lib/config/session"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { SignJWT } from "jose"
import { env } from "@/lib/config/env"
import { parseSiweMessage } from "viem/siwe"
import { createPublicClient, http } from "viem"
import { holesky } from "viem/chains"

export async function POST(request: Request) {
  const session = await getIronSession<{ nonce: string }>(
    await cookies(),
    IRON_OPTIONS
  )

  const { message, signature } = await request.json()

  const publicClient = createPublicClient({
    chain: holesky,
    transport: http(),
  })

  const siweMessage = parseSiweMessage(message)
  const valid = publicClient.verifySiweMessage({ message, signature })

  if (siweMessage.nonce !== session.nonce) {
    return NextResponse.json({ message: "Invalid nonce." }, { status: 422 })
  }

  if (
    !valid ||
    !siweMessage.address ||
    !siweMessage.chainId ||
    !siweMessage.domain
  ) {
    return NextResponse.json({ message: "Invalid message." }, { status: 422 })
  }

  const jwt = await generateJwt({
    address: siweMessage.address,
    chainId: siweMessage.chainId,
    domain: siweMessage.domain,
    nonce: siweMessage.nonce,
  })

  return NextResponse.json({ jwt })
}

async function generateJwt(payload: {
  address: string
  chainId: number
  domain: string
  nonce: string
}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setAudience("authenticated")
    .sign(new TextEncoder().encode(env.JWT_SECRET_KEY))
}
