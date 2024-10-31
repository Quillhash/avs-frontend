"use client"
import { publicClient } from "@/app/contract/client"
import { AuditCard } from "@/components"
import {
  CHAINS,
  SERVICE_MANAGER_CONTRACT_ADDRESS,
  QUILLTOKEN_ADDRESS,
} from "@/lib/constants"
import { useAuditedContracts } from "@/lib/hooks/useAuditedContracts"
import { useQTAllowance } from "@/lib/hooks/useQTAllowance"
import { Button, Chip, cn, Input, Spinner, Tooltip } from "@nextui-org/react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import { isAddress, maxUint256, parseAbi } from "viem"
import { useAccount, useBalance, useWriteContract } from "wagmi"

export default function Audit() {
  const selectedChain = CHAINS[0]
  const [contractAddress, setContractAddress] = useState("")
  const [loading, setLoading] = useState(false)

  const { address } = useAccount()
  const { data: balance } = useBalance({
    address,
    token: QUILLTOKEN_ADDRESS,
    query: { enabled: !!address },
  })

  const { data, isLoading } = useAuditedContracts(true)

  const { refetch: refetchAllowance, isFetching: allowanceLoading } =
    useQTAllowance()
  const { isPending, writeContractAsync } = useWriteContract()

  const handleAuditSubmit = async () => {
    if (!contractAddress || !isAddress(contractAddress))
      return toast.error("Please enter a valid contract address.")
    if (!balance?.value)
      return toast.error("Insufficient QuillToken balance.", {
        description:
          "You can mint QuillTokens by clicking the QuillTokens button on the Navbar.",
      })

    const allowance = (await refetchAllowance())?.data

    if (!allowance || allowance <= 1) {
      const hash = await writeContractAsync(
        {
          address: QUILLTOKEN_ADDRESS,
          abi: parseAbi(["function approve(address spender, uint256 amount)"]),
          functionName: "approve",
          args: [SERVICE_MANAGER_CONTRACT_ADDRESS, maxUint256],
        },
        {
          onError: (error) => {
            console.error(error)
            toast.error("Failed to submit audit task")
          },
        }
      )

      setLoading(true)
      const data = await publicClient.waitForTransactionReceipt({ hash })
      setLoading(false)

      if (data?.status === "reverted") {
        toast.error("Failed to submit audit task")
        return
      }
    }

    await writeContractAsync(
      {
        address: SERVICE_MANAGER_CONTRACT_ADDRESS,
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
          setContractAddress("")
          toast.success("Audit report task submitted successfully.", {
            description:
              "You will be able to view the report once the audit is completed.",
          })
        },
      }
    )
  }

  return (
    <div className="grid max-h-screen items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <main className="flex flex-col items-center justify-center gap-8">
        <div className="text-center font-mono text-2xl font-bold">
          Get Started by{" "}
          <span className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Auditing
          </span>{" "}
          Your Contracts
        </div>

        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full max-w-xl flex-col gap-2 md:flex-row">
            <Input
              type="text"
              label="Smart Contract Address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              description="Note: Make sure that the pragma selection of the provided contract is not more than 0.8.23"
              classNames={{
                description: "text-sm",
              }}
            />
            <Button
              size="lg"
              color="primary"
              className="h-14 font-semibold disabled:cursor-not-allowed disabled:opacity-70 max-md:w-full"
              variant="shadow"
              disabled={!contractAddress}
              onClick={handleAuditSubmit}
              isLoading={isPending || loading || allowanceLoading}
            >
              Audit
            </Button>
          </div>

          <div className="flex flex-row flex-wrap gap-2">
            {CHAINS.map((chain) => (
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

      <div className="text-center">
        <div className="mb-8 flex flex-col items-center justify-center gap-8">
          <div className="text-center font-mono text-2xl font-bold">
            Recently{" "}
            <span className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Audited
            </span>{" "}
            Contracts
          </div>
        </div>

        {isLoading ? (
          <Spinner size="lg" color="secondary" />
        ) : data?.audits?.length ? (
          <div className="grid max-w-4xl grid-cols-1 items-stretch justify-center gap-8 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  )
}
