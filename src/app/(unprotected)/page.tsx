"use client"
import Image from "next/image"
import { Button } from "@nextui-org/button"
import { Logo } from "@/components"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <main className="row-start-2 flex flex-col items-center justify-center gap-8">
        <Logo />

        <div className="text-center font-mono text-2xl font-bold">
          Get{" "}
          <span className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Insured
          </span>{" "}
          Against Smart Contract{" "}
          <span className="inline-block bg-gradient-to-br from-warning to-danger bg-clip-text text-transparent">
            Risks
          </span>
        </div>

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
                className="bg-gradient-to-br from-secondary to-primary text-base font-semibold"
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
                className="bg-gradient-to-br from-secondary to-primary text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50"
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
