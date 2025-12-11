"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, BookOpen, Shuffle, ClipboardList, AlertCircle } from "lucide-react"

const navigationItems = [
  {
    label: "首页",
    href: "/",
    icon: Home,
  },
  {
    label: "顺序",
    href: "/sequential",
    icon: BookOpen,
  },
  {
    label: "随机",
    href: "/random",
    icon: Shuffle,
  },
  {
    label: "考试",
    href: "/exam",
    icon: ClipboardList,
  },
  {
    label: "错题",
    href: "/errors",
    icon: AlertCircle,
  },
]

export function BottomNavigation() {
  const pathname = usePathname()

  if (pathname === "/sequential" || pathname === "/random" || pathname === "/exam") {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <nav className="max-w-md mx-auto px-2 py-2">
        <div className="flex justify-around items-center">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors min-w-0 flex-1",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
