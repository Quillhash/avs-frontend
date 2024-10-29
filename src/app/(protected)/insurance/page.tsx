"use client"
import { InsuranceCard } from "@/components"
import { availableChains } from "@/lib/constants"

export default function Insurance() {
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

      <div className="row-start-2 grid max-w-4xl grid-cols-1 items-stretch justify-center gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <InsuranceCard key={index} index={index} chain={availableChains[0]} />
        ))}
      </div>
    </div>
  )
}
