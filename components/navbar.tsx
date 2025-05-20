"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Layers, Home, LayoutDashboard } from "lucide-react"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
      active: pathname === "/",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      active: pathname === "/dashboard",
    },
  ]

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Layers className="h-5 w-5" />
            <span>SiteConfig</span>
          </Link>

          <nav className="hidden md:flex gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center text-sm ${
                  item.active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <SignedOut>
            <Button variant="outline" size="sm" asChild>
              <SignInButton>
                <span>Sign In</span>
              </SignInButton>
            </Button>
            <Button variant="default" size="sm" asChild>
              <SignUpButton>
                <span>Sign Up</span>
              </SignUpButton>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
