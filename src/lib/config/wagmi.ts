import {
  sepolia,
  baseSepolia,
  scrollSepolia,
  optimismSepolia,
  arbitrumSepolia,
  polygonMumbai,
} from "viem/chains"
import { cookieStorage, createConfig, createStorage, http } from "wagmi"

export default createConfig({
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  chains: [
    sepolia,
    baseSepolia,
    scrollSepolia,
    optimismSepolia,
    arbitrumSepolia,
    polygonMumbai,
  ],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [scrollSepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
    [polygonMumbai.id]: http(),
  },
})
