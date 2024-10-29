import { holesky } from "viem/chains"
import { cookieStorage, createConfig, createStorage, http } from "wagmi"

export default createConfig({
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
  chains: [holesky],
  transports: { [holesky.id]: http() },
})
