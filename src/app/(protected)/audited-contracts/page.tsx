"use client"
import { AuditCard } from "@/components"
import { CHAINS } from "@/lib/constants"

export default function AuditedContracts() {
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

      <div className="row-start-2 grid max-w-4xl grid-cols-1 items-stretch justify-center gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <AuditCard key={index} index={index} chain={CHAINS[0]} />
        ))}
      </div>
    </div>
  )
}
