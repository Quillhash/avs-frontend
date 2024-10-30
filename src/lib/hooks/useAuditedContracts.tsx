import { useQuery } from "@tanstack/react-query"
import { AuditedContractsResponse } from "../types/common"
import { useAccount } from "wagmi"

export const useAuditedContracts = (recentOnly?: boolean) => {
  const { address } = useAccount()
  const query = useQuery<AuditedContractsResponse>({
    queryKey: ["audited-contracts", recentOnly, address],
    queryFn: async () => {
      const response = await fetch(
        `/api/audits?address=${address}${recentOnly ? "&recentOnly=true" : ""}`
      )
      const data = await response.json()
      return data
    },
    enabled: !!address,
    refetchInterval: 10 * 1000, // 10 seconds
  })

  return query
}
