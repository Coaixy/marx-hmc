"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, BookOpen, Shuffle } from "lucide-react"
import { motion } from "framer-motion"

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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <nav className="relative flex items-center gap-2 p-2 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] ring-1 ring-black/5 dark:ring-white/5 transition-all duration-500 hover:scale-105 hover:bg-white/80 dark:hover:bg-slate-900/80">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                isActive
                  ? "text-white px-6 py-3"
                  : "w-12 h-12 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-[0_4px_12px_rgba(59,130,246,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)]"
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 25,
                  }}
                >
                    {/* Inner sheen effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50" />
                </motion.div>
              )}
              
              <div className="relative z-10 flex items-center gap-2">
                <Icon 
                  className={cn(
                    "w-5 h-5 transition-transform duration-300", 
                    isActive && "scale-105" 
                  )} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                
                <motion.span
                  initial={false}
                  animate={{
                    width: isActive ? "auto" : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 30,
                  }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className={cn(
                    "text-sm font-semibold tracking-wide block pl-1", 
                    !isActive && "hidden" // Ensure hidden when width is animating to 0 to avoid layout jumping if width calculation lags
                  )}>
                    {item.label}
                  </span>
                </motion.span>
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
