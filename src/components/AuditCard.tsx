"use client"
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuditCard = ({ index, chain }: any) => {
  const address = "0x1234567890123456789012345678901234567890"
  return (
    <Card
      key={index}
      isFooterBlurred
      radius="lg"
      className="group border-none p-2 transition-all"
    >
      <CardHeader className="grid items-center gap-2 py-2">
        <p className="truncate font-mono font-semibold">{address}</p>
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

      <CardBody className="mt-4 flex flex-row items-center justify-center gap-2 rounded-xl bg-primary-foreground/5">
        {index === 0 && (
          <Image
            src={"/in-progress.png"}
            width={236}
            height={64}
            alt={"Audited"}
          />
        )}
        {index === 1 && (
          <Image src={"/error.png"} width={236} height={64} alt={"Audited"} />
        )}
        {index !== 0 && index !== 1 && (
          <>
            <div className="flex flex-col items-center justify-center gap-2 p-1">
              <h3 className="text-center text-sm font-medium">Risk Score</h3>
              <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                <Image
                  src={"/icons/security-score.svg"}
                  width={22}
                  height={22}
                  alt={"Risk Score"}
                />
                <h4 className="text-lg font-bold text-[#EEE]">98.32%</h4>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 p-1">
              <h3 className="text-center text-sm font-medium">Issues Found</h3>
              <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                <Image
                  src={"/icons/remaining.svg"}
                  width={22}
                  height={22}
                  alt={"Risk Score"}
                />
                <h4 className="text-lg font-bold text-[#EEE]">3</h4>
              </div>
            </div>
          </>
        )}
      </CardBody>

      {index !== 0 && index !== 1 && (
        <CardFooter
          className="absolute bottom-2 z-10 hidden w-[calc(100%_-_16px)] gap-2 overflow-hidden rounded-large border-1 border-white/20 p-2 shadow-2xl transition-all group-hover:flex"
          style={{ animation: "fadeInUp 0.25s" }}
        >
          <Button
            variant="shadow"
            color="primary"
            size="sm"
            fullWidth
            as={Link}
            href={`/audited-contracts/${address}`}
          >
            View Report
          </Button>

          {index % 2 === 0 ? (
            <Button variant="shadow" color="success" size="sm" fullWidth>
              Claim Insurance
            </Button>
          ) : (
            <Button variant="shadow" color="warning" size="sm" fullWidth>
              Get Insurance
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
