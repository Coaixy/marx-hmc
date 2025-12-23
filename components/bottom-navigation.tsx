"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, BookOpen, Shuffle } from "lucide-react"

const isDev = process.env.NODE_ENV === "development"
const suffix = isDev ? "" : ".html"

const navigationItems = [
  {
    label: "首页",
    href: "/",
    icon: Home,
  },
  {
    label: "背题",
    href: `/sequential${suffix}`,
    icon: BookOpen,
  },
  {
    label: "随机",
    href: `/random${suffix}`,
    icon: Shuffle,
  },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 ring-1 ring-white/50 dark:ring-slate-700/50">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                isActive
                  ? "bg-blue-600 text-white px-5 py-2.5 gap-2 shadow-lg shadow-blue-600/25"
                  : "w-12 h-12 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 transition-transform duration-500", 
                  isActive && "scale-105"
                )} 
                strokeWidth={2.5} 
              />
              
              <span className={cn(
                "text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-500",
                isActive ? "max-w-[100px] opacity-100 translate-x-0" : "max-w-0 opacity-0 -translate-x-2 hidden"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
