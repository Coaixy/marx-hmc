"use client"

import { useState, useEffect } from "react"
import { Timer, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export function CountdownTimer() {
  const targetDate = new Date("2025-12-29T13:30:00")
  
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date()
    const difference = targetDate.getTime() - now.getTime()
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    }
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (timeLeft.isExpired) {
    return (
      <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 shadow-sm overflow-hidden">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-900 dark:text-red-100">考试已开始</p>
              <p className="text-xs text-red-600 dark:text-red-400">祝各位旗开得胜！</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Timer className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                距离考试还有
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  12.29 13:30
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">抓紧时间，最后冲刺！</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <TimeUnit value={timeLeft.days} label="天" />
            <TimeUnit value={timeLeft.hours} label="时" />
            <TimeUnit value={timeLeft.minutes} label="分" />
            <TimeUnit value={timeLeft.seconds} label="秒" isLast />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TimeUnit({ value, label, isLast = false }: { value: number, label: string, isLast?: boolean }) {
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <div className="bg-white dark:bg-slate-900 min-w-[40px] md:min-w-[48px] h-10 md:h-12 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
            {value.toString().padStart(2, '0')}
          </span>
        </div>
        <span className="text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</span>
      </div>
      {!isLast && (
        <span className="mx-1 md:mx-2 text-slate-300 dark:text-slate-700 font-bold mb-5">:</span>
      )}
    </div>
  )
}

