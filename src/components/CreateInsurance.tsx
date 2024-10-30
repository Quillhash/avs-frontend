"use client"
import { publicClient } from "@/app/contract/client"
import {
  QUILLTOKEN_ADDRESS,
  SERVICE_MANAGER_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { Audit } from "@/lib/types/common"
import { calculatePremiumPayable } from "@/lib/utils/calculatePremiumPayable"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react"
import { useState } from "react"
import { toast } from "sonner"
import { parseAbi, parseEther } from "viem"
import { useAccount, useBalance, useWriteContract } from "wagmi"

type P = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  audit: Audit
}

export const CreateInsurance = ({ isOpen, onOpenChange, audit }: P) => {
  const [loading, setLoading] = useState(false)
  const { isPending, writeContractAsync } = useWriteContract()

  const { address } = useAccount()
  const { data: balance } = useBalance({
    address,
    token: QUILLTOKEN_ADDRESS,
    query: { enabled: !!address },
  })

  const riskScore = audit?.report?.score
  const [coverageAmount, setCoverageAmount] = useState<number>()
  const [duration, setDuration] = useState<number>()

  const premiumPayable = calculatePremiumPayable(
    coverageAmount,
    duration,
    riskScore
  )

  const handleClose = () => {
    setCoverageAmount(undefined)
    setDuration(undefined)
    onOpenChange(false)
  }

  const onSubmit = async () => {
    if (!coverageAmount || !duration || !premiumPayable || !audit?.submissionId)
      return toast.error("Please enter a valid values.")

    if (!balance?.value) return toast.error("Insufficient QuillToken balance.")

    const hash = await writeContractAsync(
      {
        address: QUILLTOKEN_ADDRESS,
        abi: parseAbi(["function approve(address spender, uint256 amount)"]),
        functionName: "approve",
        args: [
          SERVICE_MANAGER_CONTRACT_ADDRESS,
          parseEther(premiumPayable.toString()),
        ],
      },
      {
        onError: (error) => {
          console.error(error)
          toast.error("Failed to create insurance")
        },
      }
    )

    setLoading(true)
    const data = await publicClient.waitForTransactionReceipt({ hash })
    setLoading(false)

    if (data?.status === "reverted") {
      toast.error("Failed to create insurance")
      return
    }

    await writeContractAsync(
      {
        address: SERVICE_MANAGER_CONTRACT_ADDRESS,
        abi: parseAbi([
          "function createNewInsuranceTask(uint256 _submissionId,uint256 _coverageAmount,uint256 _duration)",
        ]),
        functionName: "createNewInsuranceTask",
        args: [
          BigInt(audit?.submissionId),
          parseEther(coverageAmount.toString()),
          BigInt(duration * 2_592_000),
        ],
      },
      {
        onError: (error) => {
          console.error(error)
          toast.error("Failed to create insurance")
        },
        onSuccess: () => {
          toast.success("Insurance created successfully.", {
            description:
              "You will be able to view the report once it is approved.",
          })
          handleClose()
        },
      }
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      backdrop="blur"
      onOpenChange={handleClose}
      placement="center"
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader className="inline-flex flex-col gap-1">
          Create Insurance for <span className="truncate">{address}</span>
        </ModalHeader>

        <ModalBody>
          <div className="flex gap-2">
            <Input
              autoFocus
              label="Coverage Amount (in QT)"
              variant="bordered"
              type="number"
              value={coverageAmount?.toString()}
              onChange={(e) => setCoverageAmount(Number(e.target.value || 0))}
            />
            <Input
              label="Coverage Duration (in Months)"
              variant="bordered"
              type="number"
              value={duration?.toString()}
              onChange={(e) => setDuration(Number(e.target.value || 0))}
            />
          </div>
          <Input
            label="Premium Payable (in QT)"
            variant="flat"
            disabled
            type="number"
            value={premiumPayable?.toString()}
          />
        </ModalBody>

        <ModalFooter className="justify-center">
          <Button
            onPress={onSubmit}
            className="bg-gradient-to-br from-secondary to-primary font-semibold disabled:cursor-not-allowed disabled:opacity-70"
            fullWidth
            disabled={!coverageAmount || !duration || !premiumPayable}
            isLoading={isPending || loading}
          >
            Pay Premium and Start Insurance
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
