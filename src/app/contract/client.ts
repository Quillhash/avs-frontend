import { createPublicClient, http } from "viem"
import { holesky } from "viem/chains"

export const publicClient = createPublicClient({
  chain: holesky,
  transport: http(process.env.RPC_URL),
})
