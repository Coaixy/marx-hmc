"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, BookOpen, Shuffle } from "lucide-react"
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
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <nav className="relative flex items-center gap-1.5 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 hover:bg-white/90 dark:hover:bg-slate-900/90">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center justify-center rounded-full transition-all duration-500 ease-in-out",
                isActive
                  ? "text-white px-5 py-2.5"
                  : "w-11 h-11 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-blue-600 dark:bg-blue-500 rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.4)]"
                  transition={{
                    type: "spring",
                    stiffness: 160,
                    damping: 22,
                  }}
                >
                    {/* Subtle sheen */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/5 to-white/10" />
                </motion.div>
              )}
              
              <div className="relative z-10 flex items-center gap-1.5">
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
                    stiffness: 180,
                    damping: 24,
                  }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className="text-sm font-medium tracking-tight block pl-0.5">
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
