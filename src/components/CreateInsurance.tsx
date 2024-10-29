"use client"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react"
import { useAccount } from "wagmi"

type P = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  address: string
  // riskScore: number
}

export const CreateInsurance = ({
  isOpen,
  onOpenChange,
  address,
  // riskScore,
}: P) => {
  const { address: userAddress } = useAccount()

  const coverageAmount = 1000
  const riskScore = 20
  const duration = 12

  // 𝐶×(_riskScore×1𝑒16)×(_duration×1𝑒18/31536000)/1𝑒36
  const premiumPayable =
    (coverageAmount * (riskScore * 1e16) * ((duration * 1e18) / 31536000)) /
    1e36

  console.log("premiumPayable", {
    premiumPayable,
    coverageAmount,
    riskScore,
    duration,
  })

  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      backdrop="blur"
      onOpenChange={onOpenChange}
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="inline-flex flex-col gap-1">
              Create Insurance for <span className="truncate">{address}</span>
            </ModalHeader>

            <ModalBody>
              <div className="flex gap-2">
                <Input
                  autoFocus
                  label="Coverage Amount (QT)"
                  variant="bordered"
                />
                <Input label="Coverage Duration (months)" variant="bordered" />
              </div>
              <Input label="Premium Payable (QT)" variant="bordered" disabled />
            </ModalBody>

            <ModalFooter className="justify-center">
              <Button
                color="primary"
                onPress={onClose}
                className="font-semibold"
                fullWidth
              >
                Pay Premium
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
