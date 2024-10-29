"use client"
import { AuditCard } from "@/components"
import {
  availableChains,
  INSURANCE_CONTRACT_ADDRESS,
  QUILLTOKEN_ADDRESS,
} from "@/lib/constants"
import { Button, Chip, cn, Input, Tooltip } from "@nextui-org/react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import { isAddress, parseAbi } from "viem"
import { useAccount, useBalance, useWriteContract } from "wagmi"

export default function Audit() {
  const selectedChain = availableChains[0]
  const [contractAddress, setContractAddress] = useState<string>()

  const { address } = useAccount()
  const { data } = useBalance({
    address,
    token: QUILLTOKEN_ADDRESS,
    query: { enabled: !!address },
  })

  const { isPending, writeContractAsync } = useWriteContract()

  const handleAuditSubmit = async () => {
    if (!contractAddress || !isAddress(contractAddress))
      return toast.error("Please enter a valid contract address.")
    if (!data?.value) return toast.error("Insufficient QuillToken balance.")
    console.log("contractAddress", contractAddress)

    await writeContractAsync(
      {
        address: QUILLTOKEN_ADDRESS,
        abi: parseAbi(["function approve(address spender, uint256 amount)"]),
        functionName: "approve",
        args: [INSURANCE_CONTRACT_ADDRESS, data?.value],
      },
      {
        onError: (error) => {
          console.error(error)
          toast.error("Failed to approve QuillToken")
        },
      }
    )

    await writeContractAsync(
      {
        address: INSURANCE_CONTRACT_ADDRESS,
        abi: parseAbi(["function createNewAuditTask(address contractAddress)"]),
        functionName: "createNewAuditTask",
        args: [contractAddress as `0x${string}`],
      },
      {
        onError: (error) => {
          console.error(error)
          toast.error("Failed to submit audit task")
        },
        onSuccess: () => {
          toast.success("Audit report task submitted successfully.", {
            description:
              "You will be able to view the report once the audit is completed.",
          })
          setContractAddress(undefined)
        },
      }
    )
  }

  return (
    <div className="grid max-h-screen grid-rows-[1fr_1fr] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <main className="flex flex-col items-center justify-center gap-8">
        <div className="text-center font-mono text-2xl font-bold">
          Get Started by{" "}
          <span className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Auditing
          </span>{" "}
          Your Contracts
        </div>

        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full max-w-xl flex-col items-center gap-4 md:flex-row">
            <Input
              type="text"
              label="Smart Contract Address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
            <Button
              size="lg"
              color="primary"
              className="font-semibold disabled:cursor-not-allowed disabled:opacity-70 max-md:w-full"
              variant="shadow"
              disabled={!contractAddress}
              onClick={handleAuditSubmit}
              isLoading={isPending}
            >
              Audit
            </Button>
          </div>

          <div className="flex flex-row flex-wrap gap-2">
            {availableChains.map((chain) => (
              <Tooltip
                content={chain.id === 17000 ? "" : "Coming Soon"}
                isDisabled={chain.id === 17000}
                key={chain.id}
              >
                <Chip
                  color={
                    selectedChain?.id === chain.id ? "secondary" : "default"
                  }
                  startContent={
                    <Image
                      src={chain.icon}
                      alt={chain.name}
                      width={20}
                      height={20}
                    />
                  }
                  className={cn("cursor-pointer transition", {
                    "cursor-not-allowed opacity-70": chain.id !== 17000,
                  })}
                  variant={selectedChain?.id === chain.id ? "shadow" : "faded"}
                >
                  {chain.name}
                </Chip>
              </Tooltip>
            ))}
          </div>
        </div>
      </main>

      <div className="">
        <div className="mb-8 flex flex-col items-center justify-center gap-8">
          <div className="text-center font-mono text-2xl font-bold">
            Recently{" "}
            <span className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Audited
            </span>{" "}
            Contracts
          </div>
        </div>

        <div className="grid max-w-4xl grid-cols-1 items-stretch justify-center gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <AuditCard key={index} index={index} chain={availableChains[0]} />
          ))}
        </div>
      </div>
    </div>
  )
}
