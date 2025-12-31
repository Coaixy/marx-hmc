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

interface Exam {
  name: string
  date: string
  displayDate: string
}

const EXAMS: Exam[] = [
  { name: "医学检验报告单解读", date: "2025-12-29T13:30:00", displayDate: "12.29 13:30" },
  { name: "生物化学", date: "2025-12-30T13:30:00", displayDate: "12.30 13:30" },
  { name: "卫生法学与医学伦理", date: "2025-12-31T09:00:00", displayDate: "12.31 09:00" },
  { name: "细胞生物学", date: "2026-01-04T12:05:00", displayDate: "1.4 12:05" },
  { name: "临床基础检验", date: "2026-01-05T09:00:00", displayDate: "1.5 09:00" },
  { name: "临床生物化学检验", date: "2026-01-06T16:30:00", displayDate: "1.6 16:30" },
  { name: "马克思主义基本原理", date: "2026-01-07T16:30:00", displayDate: "1.7 16:30" },
  { name: "大学英语", date: "2026-01-08T16:30:00", displayDate: "1.8 16:30" },
  { name: "医学信息检索与利用", date: "2026-01-10T14:00:00", displayDate: "1.10 14:00" },
]

export function CountdownTimer() {
  const [nextExam, setNextExam] = useState<Exam | null>(null)
  
  const calculateTimeLeft = (targetDate: Date): TimeLeft => {
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

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const upcoming = EXAMS.find(exam => new Date(exam.date).getTime() > now.getTime())
      
      if (upcoming) {
        setNextExam(upcoming)
        setTimeLeft(calculateTimeLeft(new Date(upcoming.date)))
      } else {
        setNextExam(null)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true })
      }
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!timeLeft || timeLeft.isExpired) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 shadow-sm overflow-hidden">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Calendar className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-semibold text-destructive">
                {nextExam ? "考试已开始" : "所有考试已结束"}
              </p>
              <p className="text-xs text-destructive/80">
                {nextExam ? `当前：${nextExam.name}` : "祝各位假期愉快！"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-none bg-gradient-to-r from-primary/5 to-secondary/5 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
      <CardContent className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-3 bg-background rounded-2xl shadow-sm border border-border">
              <Timer className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2 flex-wrap">
                距离 <span className="text-primary underline decoration-2 decoration-primary/30 underline-offset-4">{nextExam?.name}</span> 还有
              </h3>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-xs font-medium text-muted-foreground bg-background/50 px-2 py-0.5 rounded-md border border-border/50">
                  {nextExam?.displayDate}
                </span>
                <span className="text-xs text-muted-foreground/80">抓紧时间，最后冲刺！</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
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
      <div className="flex flex-col items-center gap-1">
        <div className="bg-background min-w-[44px] md:min-w-[56px] h-12 md:h-14 flex items-center justify-center rounded-xl border border-border shadow-inner ring-1 ring-border/50">
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent tabular-nums">
            {value.toString().padStart(2, '0')}
          </span>
        </div>
        <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      {!isLast && (
        <span className="mx-1 md:mx-2 text-primary/30 font-bold text-xl mb-6 animate-pulse">:</span>
      )}
    </div>
  )
}

