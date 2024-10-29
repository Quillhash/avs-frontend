"use client"
import { AuditCard } from "@/components"
import { Button, Chip, Input } from "@nextui-org/react"
import Image from "next/image"
import { useState } from "react"

const availableChains = [
  {
    name: "Sepolia Testnet",
    id: 1,
    icon: "/icons/eth.svg",
  },
  {
    name: "Holesky Testnet",
    id: 2,
    icon: "/icons/eth.svg",
  },
  {
    name: "Base Goerli Testnet",
    id: 3,
    icon: "/icons/base.svg",
  },
]

export default function Audit() {
  const [selectedChain, setSelectedChain] = useState<
    (typeof availableChains)[number]
  >(availableChains[0])

  return (
    <div className="grid max-h-screen grid-rows-[20px_1fr_1fr] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <main className="row-start-2 flex flex-col items-center justify-center gap-8">
        <div className="text-center font-mono text-2xl font-bold">
          Get Started by{" "}
          <span className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Auditing
          </span>{" "}
          Your Contracts
        </div>

        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full max-w-xl flex-col items-center gap-4 md:flex-row">
            <Input type="text" label="Smart Contract Address" />
            <Button
              size="lg"
              color="primary"
              className="font-semibold max-md:w-full"
              variant="shadow"
            >
              Audit
            </Button>
          </div>

          <div className="flex flex-row flex-wrap gap-2">
            {availableChains.map((chain) => (
              <Chip
                key={chain.id}
                color={selectedChain?.id === chain.id ? "secondary" : "default"}
                startContent={
                  <Image
                    src={chain.icon}
                    alt={chain.name}
                    width={20}
                    height={20}
                  />
                }
                className="cursor-pointer transition"
                onClick={() => setSelectedChain(chain)}
                variant={selectedChain?.id === chain.id ? "shadow" : "faded"}
              >
                {chain.name}
              </Chip>
            ))}
          </div>
        </div>
      </main>

      <div className="row-start-3">
        <div className="mb-8 flex flex-col items-center justify-center gap-8">
          <div className="text-center font-mono text-2xl font-bold">
            Recently{" "}
            <span className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Audited
            </span>{" "}
            Contracts
          </div>
        </div>

        <div className="grid max-w-4xl grid-cols-1 items-center justify-center gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <AuditCard key={index} index={index} chain={availableChains[0]} />
          ))}
        </div>
      </div>
    </div>
  )
}
