"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, BookOpen, Shuffle, ClipboardList, AlertCircle, Search } from "lucide-react"

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
  {
    label: "搜题",
    href: `/search${suffix}`,
    icon: Search,
  },
  {
    label: "考试",
    href: `/exam${suffix}`,
    icon: ClipboardList,
  },
  {
    label: "错题",
    href: `/errors${suffix}`,
    icon: AlertCircle,
  },
]

export function BottomNavigation() {
  const pathname = usePathname()


  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/60 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
        <nav className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-around items-center">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-300 min-w-16",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <div className={cn(
                    "relative transition-all duration-300",
                    isActive ? "-translate-y-1" : "group-hover:-translate-y-0.5"
                  )}>
                    <Icon className={cn("w-6 h-6", isActive && "fill-blue-100 dark:fill-blue-900/40")} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium transition-all duration-300 absolute -bottom-0.5",
                    isActive 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                  )}>
                    {item.label}
                  </span>
                  
                  {/* 选中时的底部光点，增强活跃感 */}
                  {isActive && (
                    <span className="absolute -bottom-1 w-8 h-1 bg-blue-600/20 dark:bg-blue-400/20 blur-sm rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
