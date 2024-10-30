"use client"
import { CHAINS } from "@/lib/constants"
import { Audit } from "@/lib/types/common"
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Spinner,
} from "@nextui-org/react"
import { IconCircleCheckFilled } from "@tabler/icons-react"
import Image from "next/image"
import { toast } from "sonner"

type AuditCardProps = {
  chain: (typeof CHAINS)[0]
  audit?: Audit
}

export const InsuranceCard = ({ chain, audit }: AuditCardProps) => {
  const durationInMS =
    (audit?.policies?.endTime || 0) - (audit?.policies?.startTime || 0)
  const durationInMonths = Math.abs(durationInMS) / 30 / 24 / 60 / 60 / 1000

  return (
    <Card
      isFooterBlurred
      radius="lg"
      className="group border-none p-2 transition-all"
    >
      <CardHeader className="grid items-center gap-2 py-2">
        <p className="truncate font-mono font-semibold">
          {audit?.submission?.contractAddress}
        </p>
        <Chip
          size="sm"
          color="secondary"
          variant="shadow"
          startContent={
            <Image src={chain.icon} alt={chain.name} width={16} height={16} />
          }
        >
          {chain.name}
        </Chip>
      </CardHeader>

      <CardBody className="mt-4 flex flex-row flex-wrap items-center justify-center gap-2 rounded-xl bg-primary-foreground/5">
        {audit?.policies?.status === 2 && (
          <div className="flex flex-col items-center justify-center gap-2 p-1 text-center">
            <Spinner size="lg" className="h-16 w-16" color="warning" />
            <div className="text-xl font-semibold text-warning">
              Awaiting Verification
            </div>
            <div className="text-sm">
              It might take a few hours to verify your claim
            </div>
          </div>
        )}

        {/* {audit?.policies?.status === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 p-1 text-center">
            <IconCircleXFilled size={64} className="text-danger" />
            <div className="text-xl font-semibold text-danger">
              Claim Rejected
            </div>
            <div className="text-sm">
              You will be able to apply again after 3 months
            </div>
          </div>
        )} */}

        {audit?.policies?.status === 3 && (
          <div className="flex flex-col items-center justify-center gap-2 p-1 text-center">
            <IconCircleCheckFilled size={64} className="text-success" />
            <div className="text-xl font-semibold text-success">
              Claim Processed
            </div>
            <div className="text-sm">
              Coverage amount will be credited to your wallet
            </div>
          </div>
        )}

        {audit?.policies?.status === 1 && (
          <>
            <div className="flex flex-col items-center justify-center gap-2 p-1 text-center">
              <h3 className="text-center text-sm font-medium">Duration</h3>
              <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                <h4 className="text-lg font-bold text-[#EEE]">
                  {durationInMonths} months
                </h4>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 p-1 text-center">
              <h3 className="text-center text-sm font-medium">
                Coverage Amount
              </h3>
              <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                <h4 className="text-lg font-bold text-[#EEE]">
                  {audit?.policies?.coverageAmount} QT
                </h4>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 p-1 text-center">
              <h3 className="text-center text-sm font-medium">Risk Score</h3>
              <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                <Image
                  src={"/icons/security-score.svg"}
                  width={22}
                  height={22}
                  alt={"Risk Score"}
                />
                <h4 className="text-lg font-bold text-[#EEE]">
                  {audit?.report?.ipfsInfo?.auditReport?.securityScore}%
                </h4>
              </div>
            </div>
          </>
        )}
      </CardBody>

      {audit?.policies?.status === 1 && (
        <CardFooter
          className="absolute bottom-2 z-10 hidden w-[calc(100%_-_16px)] gap-2 overflow-hidden rounded-large border-1 border-white/20 p-2 shadow-2xl transition-all group-hover:flex"
          style={{ animation: "fadeInUp 0.25s" }}
        >
          <Button
            variant="shadow"
            color="success"
            size="sm"
            fullWidth
            onClick={() =>
              toast.success("Insurance claim sent for verification.")
            }
          >
            Claim Insurance
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
