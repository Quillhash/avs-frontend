"use client"
import { AuditCard } from "@/components"
import { CHAINS } from "@/lib/constants"
import { AuditedContractsResponse } from "@/lib/types/common"
import { Spinner } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"

export default function AuditedContracts() {
  const { address } = useAccount()
  const { data, isLoading } = useQuery<AuditedContractsResponse>({
    queryKey: ["audited-contracts", "all", address],
    queryFn: async () => {
      // TODO: Replace with actual contract address
      const address = "0x0f06bF73403682893aC9dA53b59340c65C95807A"
      const response = await fetch(`/api/audits?address=${address}&limit=12`)
      const data = await response.json()
      return data
    },
    enabled: !!address,
  })

  return (
    <div className="grid max-h-screen grid-rows-[32px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <div className="row-start-1 flex flex-col items-center justify-center gap-8">
        <div className="text-center font-mono text-2xl font-bold">
          <span className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Audited
          </span>{" "}
          Smart Contracts
        </div>
      </div>

      {isLoading ? (
        <Spinner size="lg" color="primary" />
      ) : data?.audits?.length ? (
        <div className="row-start-2 grid max-w-4xl grid-cols-1 items-stretch justify-center gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data?.audits.map((audit) => (
            <AuditCard
              key={audit?.submission?.timestamp}
              chain={CHAINS[0]}
              audit={audit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center font-mono text-lg text-primary-foreground/50">
          No Audits Yet
        </div>
      )}
    </div>
  )
}
