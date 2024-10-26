import Image from "next/image"

export const Logo = () => {
  return (
    <div className="flex items-end gap-3">
      <Image
        src="/logos/og-logo.svg"
        alt="logo"
        width={180}
        height={34}
        priority
      />
      <span className="from-secondary to-primary inline-block bg-gradient-to-br bg-clip-text font-mono text-3xl leading-none text-transparent">
        AVS
      </span>
    </div>
  )
}
