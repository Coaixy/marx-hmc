"use client"

import { Snowflake, Gift, Trees as Tree } from "lucide-react"

export function ChristmasDecorations() {
  return (
    <>
      {/* Top Left Corner */}
      <div className="fixed top-0 left-0 p-4 pointer-events-none z-40 opacity-20 sm:opacity-40 select-none">
         <div className="relative">
            <Tree className="w-16 h-16 text-green-600 dark:text-green-500 animate-pulse" />
            <Snowflake className="w-6 h-6 text-white absolute top-0 right-0 animate-bounce" />
         </div>
      </div>

      {/* Top Right Corner */}
      <div className="fixed top-0 right-0 p-4 pointer-events-none z-40 opacity-20 sm:opacity-40 select-none">
         <div className="relative">
            <Gift className="w-12 h-12 text-red-500 dark:text-red-400 animate-bounce" />
            <div className="absolute -top-2 -right-1 text-2xl">🎄</div>
         </div>
      </div>

      {/* Floating Elements (Optional, maybe too much) */}
    </>
  )
}

export function ChristmasHat({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute -top-3 -left-3 text-2xl rotate-[-20deg] select-none z-20">
        🎅
      </span>
    </div>
  )
}

