"use client"
import { Button, Input } from "@nextui-org/react"

export default function Insurance() {
  return (
    <div className="grid max-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <main className="row-start-2 flex flex-col items-center justify-center gap-8">
        <div className="text-center font-mono text-2xl font-bold">
          Get{" "}
          <span className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Insured
          </span>{" "}
          By Selecting Audited Contract
        </div>

        <div className="flex w-full max-w-xl flex-col items-center gap-4 md:flex-row">
          <Input type="text" label="Smart Contract Address" />
          <Button
            size="lg"
            color="primary"
            className="font-semibold max-md:w-full"
          >
            Continue
          </Button>
        </div>
      </main>
    </div>
  )
}
