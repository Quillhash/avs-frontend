"use client"
import {
  Navbar as NavbarNUI,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link as LinkNUI,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  cn,
} from "@nextui-org/react"
import { Logo } from "./Logo"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import { formatEther, parseAbi, parseEther } from "viem"
import { useEffect, useState } from "react"
import { QUILLTOKEN_ADDRESS } from "@/lib/constants"
import { IconCoinBitcoin, IconPlus } from "@tabler/icons-react"

const menuItems = [
  { name: "Audit", path: "/audit" },
  { name: "Audited Contracts", path: "/audited-contracts" },
  { name: "Insurance", path: "/insurance" },
]

const formatBalance = (value?: bigint) => {
  return formatEther(value || BigInt(0))
}

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const { address } = useAccount()
  const { data, isLoading, refetch } = useBalance({
    address,
    token: "0x7607C082538c187F9050e23680D52B7EFC190011",
    query: { enabled: !!address },
  })

  const { data: hash, writeContract, isPending } = useWriteContract()

  async function submit() {
    if (!address) return

    writeContract({
      address: QUILLTOKEN_ADDRESS,
      abi: parseAbi(["function mint(address account, uint256 amount)"]),
      functionName: "mint",
      args: [address, parseEther("10")],
    })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  useEffect(() => {
    refetch()
  }, [isConfirmed])

  const loading = isLoading || isConfirming || isPending

  const TokenBalanceComponent = ({ top }: { top?: boolean }) => {
    return (
      <Dropdown>
        <DropdownTrigger>
          <Button
            startContent={<IconCoinBitcoin />}
            className={cn(
              "flex bg-gradient-to-br from-success to-warning text-base font-semibold",
              { "max-sm:hidden max-sm:min-w-10": top }
            )}
            isLoading={loading}
          >
            {loading ? (
              ""
            ) : (
              <>
                <span className="max-w-14 truncate font-mono">
                  {formatBalance(data?.value)}
                </span>{" "}
                {data?.symbol}
              </>
            )}
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Actions" variant="flat">
          <DropdownItem startContent={<IconCoinBitcoin />} key="Balance">
            <div className="font-mono text-base font-semibold">
              {formatBalance(data?.value)}
            </div>
            <div className="text-sm">QuillTokens</div>
          </DropdownItem>

          <DropdownItem
            key="Mint QuillTokens"
            onClick={submit}
            startContent={<IconPlus />}
          >
            Mint QuillTokens
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
  }

  return (
    <NavbarNUI onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden"
        />
        <NavbarBrand>
          <Logo isNavbar />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 lg:flex" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.name} isActive={pathname === item.path}>
            <LinkNUI
              color={pathname === item.path ? undefined : "foreground"}
              href={item.path}
              as={Link}
            >
              {item.name}
            </LinkNUI>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <TokenBalanceComponent top />

        <ConnectButton.Custom>
          {({ authenticationStatus, mounted, account, openAccountModal }) => (
            <Button
              className="bg-gradient-to-br from-secondary to-primary text-base font-semibold max-sm:min-w-10"
              size="md"
              variant="shadow"
              color="primary"
              startContent={<span>🤯</span>}
              onClick={openAccountModal}
              disabled={!mounted || authenticationStatus !== "authenticated"}
            >
              <span className="max-sm:hidden">{account?.displayName}</span>
            </Button>
          )}
        </ConnectButton.Custom>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.name}>
            <LinkNUI
              color={pathname === item.path ? undefined : "foreground"}
              className="w-full"
              href={item.path}
              size="lg"
              as={Link}
            >
              {item.name}
            </LinkNUI>
          </NavbarMenuItem>
        ))}

        <NavbarMenuItem className="hidden max-sm:list-item">
          <TokenBalanceComponent />
        </NavbarMenuItem>
      </NavbarMenu>
    </NavbarNUI>
  )
}
