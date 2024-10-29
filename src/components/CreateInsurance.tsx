"use client"
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
import { useAccount } from "wagmi"

type P = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  address: string
  securityPercentage: number
}

export const CreateInsurance = ({
  isOpen,
  onOpenChange,
  address,
  securityPercentage,
}: P) => {
  const { address: userAddress } = useAccount()
  const [coverageAmount, setCoverageAmount] = useState<number>()
  const [duration, setDuration] = useState<number>()

  const premiumPayable = calculatePremiumPayable(
    coverageAmount,
    duration,
    securityPercentage
  )

  const handleClose = () => {
    setCoverageAmount(undefined)
    setDuration(undefined)
    onOpenChange(false)
  }

  const onSubmit = () => {
    if (!coverageAmount || !duration || !premiumPayable) return

    handleClose()

    console.log("premiumPayable", {
      premiumPayable,
      coverageAmount,
      securityPercentage,
      duration,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      backdrop="blur"
      onOpenChange={handleClose}
      placement="center"
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
            color="primary"
            onPress={onSubmit}
            className="font-semibold disabled:cursor-not-allowed disabled:opacity-70"
            fullWidth
            disabled={!coverageAmount || !duration || !premiumPayable}
          >
            Pay Premium
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
