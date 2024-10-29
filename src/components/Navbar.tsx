"use client"
import React from "react"
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
} from "@nextui-org/react"
import { Logo } from "./Logo"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { usePathname } from "next/navigation"
import Link from "next/link"

const menuItems = [
  { name: "Audit", path: "/audit" },
  { name: "Audited Contracts", path: "/audited-contracts" },
  { name: "Insurance", path: "/insurance" },
]

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const pathname = usePathname()

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
        <Button className="flex bg-gradient-to-br from-success to-warning text-base font-semibold max-sm:hidden max-sm:min-w-10">
          100 $QT
        </Button>

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
          <Button className="bg-gradient-to-br from-success to-warning text-base font-semibold">
            100 $QT
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </NavbarNUI>
  )
}
