"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, BookOpen, Shuffle, Search, ClipboardList, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

const navigationItems = [
  {
    label: "首页",
    href: "/",
    icon: Home,
  },
  {
    label: "背题",
    href: "/sequential",
    icon: BookOpen,
  },
  {
    label: "随机",
    href: "/random",
    icon: Shuffle,
  },
  {
    label: "搜题",
    href: "/search",
    icon: Search,
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

  if (pathname === "/new-year") {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-t border-black/[0.03] dark:border-white/[0.05] shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]">
      <nav className="relative flex items-center justify-around px-2 py-3">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center min-w-[60px] px-1 py-1 rounded-xl transition-colors duration-300 group",
                isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="relative">
                  <Icon 
                    className={cn(
                      "w-6 h-6 transition-all duration-500 ease-out", 
                      isActive && "fill-current scale-110 drop-shadow-sm" 
                    )} 
                    strokeWidth={isActive ? 2.5 : 2} 
                  />
                  {isActive && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute inset-0 blur-lg bg-primary/40 rounded-full"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-medium tracking-wide transition-all duration-300",
                  isActive ? "opacity-100 font-semibold translate-y-0" : "opacity-70 group-hover:opacity-100 translate-y-0.5"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}