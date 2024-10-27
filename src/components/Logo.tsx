import Image from "next/image"

export const Logo = () => {
  return (
    <div className="flex items-center gap-3 max-sm:gap-2">
      <Image
        src="/logos/og-logo.svg"
        alt="logo"
        width={180}
        height={34}
        priority
        className="h-[34px] min-h-[34px] w-[180px] min-w-[180px] max-sm:h-[20px] max-sm:min-h-[20px] max-sm:w-[108px] max-sm:min-w-[108px]"
      />
      <span className="inline-block bg-gradient-to-br from-secondary to-primary bg-clip-text font-mono text-3xl leading-none text-transparent max-sm:text-lg">
        AVS
      </span>
    </div>
  )
}
