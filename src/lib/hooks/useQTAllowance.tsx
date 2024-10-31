import { parseAbi } from "viem"
import {
  QUILLTOKEN_ADDRESS,
  SERVICE_MANAGER_CONTRACT_ADDRESS,
} from "../constants"
import { useAccount, useReadContract } from "wagmi"

export const useQTAllowance = () => {
  const { address } = useAccount()
  const allowanceQuery = useReadContract({
    address: QUILLTOKEN_ADDRESS,
    abi: parseAbi([
      "function allowance(address owner, address spender) view returns (uint256)",
    ]),
    functionName: "allowance",
    args: [address as `0x${string}`, SERVICE_MANAGER_CONTRACT_ADDRESS],
    query: { enabled: !!address },
  })

  return allowanceQuery
}
