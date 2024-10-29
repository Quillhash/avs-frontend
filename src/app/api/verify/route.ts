import { IRON_OPTIONS } from "@/lib/config/session"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { SiweMessage } from "siwe"
import { SignJWT } from "jose"
import { env } from "@/lib/config/env"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const session = await getIronSession<{ nonce: string }>(
    await cookies(),
    IRON_OPTIONS
  )

  const { message, signature } = await request.json()

  const siweMessage = new SiweMessage(message)
  const { data: fields } = await siweMessage.verify({ signature })

  if (fields.nonce !== session.nonce) {
    return NextResponse.json({ message: "Invalid nonce." }, { status: 422 })
  }

  const supabase = await createClient()
  const users = await supabase
    .from("users")
    .select("*")
    .eq("address", fields.address)

  if (users?.error) {
    console.error("error", users.error)
    return NextResponse.json(
      { message: "Failed to create user: Error code 1001." },
      { status: 422 }
    )
  }

  if (!users?.data?.[0]?.address) {
    const { error: userMetadataError } = await supabase.from("users").insert([
      {
        address: fields.address,
        auth: {
          genNonce: fields.nonce,
          lastAuth: new Date().toISOString(),
          lastAuthStatus: "success",
        },
      },
    ])

    if (userMetadataError) {
      return NextResponse.json(
        { message: "Failed to create user metadata: Error code 1003." },
        { status: 422 }
      )
    }
  }

  const { error: updateAuthError } = await supabase
    .from("users")
    .update({
      auth: {
        genNonce: fields.nonce,
        lastAuth: new Date().toISOString(),
        lastAuthStatus: "success",
      },
    })
    .eq("address", fields.address)

  if (updateAuthError) {
    return NextResponse.json(
      { message: "Failed to update user auth: Error code 1004." },
      { status: 422 }
    )
  }

  const jwt = await generateJwt(
    {
      address: fields.address,
      chainId: fields.chainId,
      domain: fields.domain,
      nonce: fields.nonce,
    },
    String(users?.data?.[0]?.id)
  )

  return NextResponse.json({ jwt })
}

async function generateJwt(
  payload: {
    address: string
    chainId: number
    domain: string
    nonce: string
  },
  userId?: string | null
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setAudience("authenticated")
    .setSubject(userId ?? "")
    .sign(new TextEncoder().encode(env.JWT_SECRET_KEY))
}
