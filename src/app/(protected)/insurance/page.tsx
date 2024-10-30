"use client"
import { InsuranceCard } from "@/components"
import { CHAINS } from "@/lib/constants"
import { useAuditedContracts } from "@/lib/hooks/useAuditedContracts"
import { Spinner } from "@nextui-org/react"
import { useMemo } from "react"

export default function Insurance() {
  const { data, isLoading } = useAuditedContracts()

  const insuranceData = useMemo(() => {
    if (!data?.audits?.length) return []

    return data?.audits?.filter((audit) => audit?.policies?.status !== 0)
  }, [data])

  return (
    <div className="grid max-h-screen grid-rows-[32px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <div className="row-start-1 flex flex-col items-center justify-center gap-8">
        <div className="text-center font-mono text-2xl font-bold">
          Claim{" "}
          <span className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Insurance
          </span>{" "}
          For Your{" "}
          <span className="inline-block bg-gradient-to-r from-warning to-danger bg-clip-text text-transparent">
            Hacked
          </span>{" "}
          Smart Contract
        </div>
      </div>

      {isLoading ? (
        <Spinner size="lg" color="warning" />
      ) : insuranceData?.length ? (
        <div className="row-start-2 grid max-w-4xl grid-cols-1 items-stretch justify-center gap-8 md:grid-cols-2 lg:grid-cols-3">
          {insuranceData?.map((audit, index) => (
            <InsuranceCard key={index} audit={audit} chain={CHAINS[0]} />
          ))}
        </div>
      ) : (
        <div className="text-center font-mono text-lg text-primary-foreground/50">
          No Active Insurance Yet
        </div>
      )}
    </div>
  )
}
