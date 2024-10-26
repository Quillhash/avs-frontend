"use client"
import { Logo } from "@/components"
import { Button } from "@nextui-org/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"

export default function Audit() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <main className="row-start-2 flex flex-col items-center justify-center gap-8">
        <Logo />

        <ConnectButton.Custom>
          {({
            openConnectModal,
            authenticationStatus,
            mounted,
            account,
            openAccountModal,
          }) =>
            authenticationStatus === "authenticated" ? (
              <Button
                className="from-secondary to-primary bg-gradient-to-br text-base font-semibold"
                size="lg"
                variant="shadow"
                color="primary"
                startContent={<span>🤯</span>}
                onClick={openAccountModal}
              >
                {account?.displayName}
              </Button>
            ) : (
              <Button
                className="from-secondary to-primary bg-gradient-to-br text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                size="lg"
                variant="shadow"
                color="primary"
                startContent={
                  <Image
                    src="/vercel.svg"
                    alt="Vercel logomark"
                    width={20}
                    height={20}
                  />
                }
                disabled={!(mounted && authenticationStatus !== "loading")}
                onClick={openConnectModal}
              >
                Connect Wallet
              </Button>
            )
          }
        </ConnectButton.Custom>
      </main>
    </div>
  )
}
