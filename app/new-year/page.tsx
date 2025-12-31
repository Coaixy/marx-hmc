"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function NewYearCountdownPage() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  function calculateTimeLeft() {
    const targetDate = new Date("2026-01-01T00:00:00")
    const now = new Date()
    const difference = targetDate.getTime() - now.getTime()

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isFinished: false,
    }
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#030303] text-white flex flex-col items-center justify-center p-6 md:p-12 font-sans selection:bg-white/20">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-between h-full min-h-[80vh]">
        
        {/* Top Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-between items-start"
        >
          <Link 
            href="/" 
            className="group flex items-center gap-3 text-sm font-medium text-white/40 hover:text-white transition-colors duration-500"
          >
            <div className="p-2 rounded-full border border-white/5 group-hover:border-white/20 transition-colors bg-white/0 group-hover:bg-white/5">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-500" />
            </div>
            <span className="tracking-widest uppercase text-xs">Back</span>
          </Link>
          
          <div className="flex flex-col items-end text-right">
             <span className="text-xs font-medium tracking-[0.2em] text-white/30 uppercase">Target</span>
             <span className="text-sm font-medium tracking-widest text-white/60">JAN 01 2026</span>
          </div>
        </motion.div>

        {/* Center Content */}
        <div className="flex flex-col items-center gap-12 md:gap-24 w-full">
          
          {/* Main Year Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <h1 className="text-[18vw] leading-none font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 select-none mix-blend-overlay opacity-90">
              2026
            </h1>
            
            {/* Overlay Gradient Text for depth */}
            <h1 className="absolute inset-0 text-[18vw] leading-none font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-transparent via-transparent to-black/10 select-none z-10 pointer-events-none" aria-hidden="true">
              2026
            </h1>
          </motion.div>

          {/* Minimal Countdown */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl border-t border-white/10 pt-12"
          >
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-x-0 md:divide-x divide-white/5">
                <MinimalTimeUnit value={timeLeft.days} label="Days" />
                <MinimalTimeUnit value={timeLeft.hours} label="Hours" />
                <MinimalTimeUnit value={timeLeft.minutes} label="Minutes" />
                <MinimalTimeUnit value={timeLeft.seconds} label="Seconds" />
             </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="w-full flex justify-center pb-8"
        >
          <p className="text-xs text-white/20 tracking-[0.3em] uppercase font-light">
            Time is the most valuable currency
          </p>
        </motion.div>

      </div>
    </main>
  )
}

function MinimalTimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4">
      <span className="text-5xl md:text-7xl font-light tracking-tighter tabular-nums text-white/90">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-xs font-medium tracking-[0.4em] uppercase text-white/30 pl-1">
        {label}
      </span>
    </div>
  )
}
