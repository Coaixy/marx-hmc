"use client"

import { useState, useEffect } from "react"
import { useSubject } from "@/components/providers/subject-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Trophy, Medal, Award, Crown } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { storage } from "@/lib/storage"

interface RankingRecord {
  nickname: string
  score: number
  duration_ms: number
  created_at: string
  device_id: string
}

export default function RankingPage() {
  const { subjectId, subject } = useSubject()
  const [rankings, setRankings] = useState<RankingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState({ deviceId: '', nickname: '' })

  useEffect(() => {
    setUserInfo(storage.getUserInfo())
    fetchRankings()
  }, [subjectId])

  const fetchRankings = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/exam/ranking?examType=${subjectId}`)
      const data = await response.json()
      if (Array.isArray(data)) {
        setRankings(data)
      }
    } catch (error) {
      console.error("Failed to fetch rankings:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}分${remainingSeconds}秒`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}-${date.getDate()}`
  }

  const getRankConfig = (index: number) => {
    switch (index) {
      case 0:
        return {
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          borderColor: "border-yellow-200 dark:border-yellow-700",
          icon: <Crown className="w-5 h-5" />,
          podiumStop: "from-yellow-50/80 to-yellow-100/20 dark:from-yellow-900/20 dark:to-transparent",
          highlightGradient: "via-yellow-400/50"
        }
      case 1:
        return {
          color: "text-slate-600 dark:text-slate-400",
          bgColor: "bg-slate-100 dark:bg-slate-800",
          borderColor: "border-slate-200 dark:border-slate-700",
          icon: <Medal className="w-5 h-5" />,
          podiumStop: "from-slate-50/80 to-slate-100/20 dark:from-slate-800/20 dark:to-transparent",
          highlightGradient: "via-slate-400/50"
        }
      case 2:
        return {
          color: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-100 dark:bg-orange-900/30",
          borderColor: "border-orange-200 dark:border-orange-700",
          icon: <Award className="w-5 h-5" />,
          podiumStop: "from-orange-50/80 to-orange-100/20 dark:from-orange-900/20 dark:to-transparent",
          highlightGradient: "via-orange-400/50"
        }
      default:
        return {
          color: "text-muted-foreground",
          bgColor: "bg-muted/50",
          borderColor: "border-transparent",
          icon: null,
          podiumStop: "",
          highlightGradient: ""
        }
    }
  }

  const SkeletonRow = () => (
    <div className="flex items-center justify-between py-4 px-4">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
        <div className="flex flex-col gap-2">
          <div className="w-24 h-3 bg-muted animate-pulse rounded" />
          <div className="w-16 h-2 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-8 h-4 bg-muted animate-pulse rounded" />
        <div className="w-12 h-4 bg-muted animate-pulse rounded" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-32">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground transition-colors group">
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
              返回
            </Button>
          </Link>
          <div className="flex flex-col items-end">
            <h1 className="text-lg font-semibold tracking-tight">
              {subject?.name || "..."}排行榜
            </h1>
            <p className="text-[10px] text-muted-foreground">Top 50 Masters</p>
          </div>
        </div>

        <Card className="border-none shadow-none bg-transparent">
          {/* Podium Section */}
          {!loading && rankings.length >= 3 && (
            <div className="mb-0">
              <div className="flex items-end justify-center gap-4 sm:gap-6 md:gap-8 max-w-sm mx-auto pb-4">
                {[1, 0, 2].map((rankIndex) => { // Order: 2nd, 1st, 3rd
                  const record = rankings[rankIndex];
                  const config = getRankConfig(rankIndex);

                  return (
                    <motion.div
                      key={`podium-${rankIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: rankIndex * 0.1 }}
                      className="flex flex-col items-center flex-1 relative"
                    >
                      {/* Rank Icon */}
                      <div className="relative mb-3 group cursor-default">
                        <div className={`
                          w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center 
                          ring-4 ring-background shadow-xs z-10 relative 
                          ${config.bgColor} ${config.color}
                        `}>
                          {config.icon}
                        </div>
                        {rankIndex === 0 && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce duration-[2000ms]">
                            <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="text-center mb-2 space-y-0.5 z-10">
                        <div className="text-xs font-medium max-w-[80px] truncate mx-auto px-1" title={record.nickname}>
                          {record.nickname}
                        </div>
                        <div className="text-sm font-bold tracking-tight">
                          {record.score}<span className="text-[10px] font-normal text-muted-foreground ml-0.5">%</span>
                        </div>
                      </div>

                      {/* Podium Step */}
                      <div className={`
                        w-full rounded-t-lg flex flex-col items-center justify-end pb-2 relative overflow-hidden backdrop-blur-sm
                        ${rankIndex === 0 ? 'h-24' : rankIndex === 1 ? 'h-16' : 'h-12'}
                        bg-gradient-to-b ${config.podiumStop}
                        border-t border-x border-white/20 dark:border-white/5 shadow-sm
                      `}>
                        <div className={`absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent ${config.highlightGradient} to-transparent`} />
                        <span className={`text-2xl font-bold opacity-30 ${config.color.split(' ')[0]}`}>{rankIndex + 1}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {/* List Section */}
          <CardContent className="p-0 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm overflow-hidden">

            {/* List Header */}
            <div className="flex items-center justify-between py-3 px-5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider bg-muted/20 border-b border-border/40">
              <div className="flex items-center gap-4">
                <span className="w-8 text-center">Rank</span>
                <span>User</span>
              </div>
              <div className="flex items-center gap-6">
                <span>Score</span>
                <span className="w-16 text-right">Time</span>
              </div>
            </div>

            {loading ? (
              <div className="divide-y divide-border/30">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
            ) : rankings.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-sm">暂无记录</div>
            ) : (
              <div className="divide-y divide-border/30">
                {rankings.map((record, index) => {
                  const isCurrentUser = record.device_id === userInfo.deviceId;
                  const config = getRankConfig(index);
                  const isTopThree = index < 3;

                  return (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + (index * 0.03) }}
                      key={`${record.device_id}-${record.created_at}`}
                      className={`
                        flex items-center justify-between py-3 px-5 group transition-all duration-200
                        ${isCurrentUser ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/30"}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank Badge */}
                        <div className="flex items-center justify-center w-8">
                          {isTopThree ? (
                            <div className={`text-sm font-bold ${config.color}`}>
                              {index + 1}
                            </div>
                          ) : (
                            <span className="text-xs font-medium text-muted-foreground/60 tabular-nums">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-medium truncate max-w-[150px] ${isCurrentUser ? "text-primary" : "text-foreground/90"}`}
                            >
                              {record.nickname}
                            </span>
                            {isCurrentUser && (
                              <span className="text-[9px] bg-primary/10 px-1.5 py-0.5 rounded-full text-primary font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground/50">
                            {formatDate(record.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6">
                        <span className={`font-bold text-sm tabular-nums ${isTopThree ? config.color : "text-foreground/80"}`}>
                          {record.score}%
                        </span>
                        <span className="text-xs text-muted-foreground/50 w-16 text-right tabular-nums font-mono">
                          {formatDuration(record.duration_ms)}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-[10px] text-muted-foreground/30 pb-4 flex items-center justify-center gap-2">
          <Trophy className="w-3 h-3" />
          <span>Keep practicing to reach the top!</span>
        </div>
      </div>
    </div>
  )
}
