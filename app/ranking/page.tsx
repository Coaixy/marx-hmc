"use client"

import { useState, useEffect } from "react"
import { useSubject } from "@/components/subject-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Trophy, Medal, Award, Crown, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { SUBJECTS } from "@/lib/question-data"
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
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  const getRankStyle = (index: number) => {
    switch(index) {
      case 0: // 第一名
        return {
          bgClass: "bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 dark:from-yellow-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 border-2 border-yellow-300/50 dark:border-yellow-700/50 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/30",
          textClass: "text-yellow-600 dark:text-yellow-400",
          icon: <Crown className="w-5 h-5" />,
          badge: "👑 冠军",
          badgeClass: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
        }
      case 1: // 第二名
        return {
          bgClass: "bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 dark:from-slate-900/30 dark:via-gray-900/30 dark:to-slate-900/30 border-2 border-slate-300/50 dark:border-slate-700/50 shadow-md shadow-slate-200/50 dark:shadow-slate-900/30",
          textClass: "text-slate-500 dark:text-slate-400",
          icon: <Medal className="w-5 h-5" />,
          badge: "🥈 亚军",
          badgeClass: "bg-gradient-to-r from-slate-400 to-gray-500 text-white"
        }
      case 2: // 第三名
        return {
          bgClass: "bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-orange-950/30 border-2 border-orange-300/50 dark:border-orange-700/50 shadow-md shadow-orange-200/50 dark:shadow-orange-900/30",
          textClass: "text-orange-600 dark:text-orange-400",
          icon: <Award className="w-5 h-5" />,
          badge: "🥉 季军",
          badgeClass: "bg-gradient-to-r from-orange-400 to-amber-500 text-white"
        }
      default:
        return {
          bgClass: "",
          textClass: "text-muted-foreground",
          icon: null,
          badge: null,
          badgeClass: ""
        }
    }
  }

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 pb-32">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" /> 返回首页
            </Button>
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            {subject?.name}
          </h1>
          <div className="w-20"></div> {/* Spacer */}
        </div>

        <Card className="border-none shadow-xl bg-background/50 backdrop-blur-md">
          {/* 前三名领奖台 */}
          {rankings.length >= 3 && (
            <div className="p-6 pb-4 border-b border-border/50">
              <div className="flex items-end justify-center gap-4 max-w-md mx-auto">
                {/* 第二名 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center flex-1"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-300 to-gray-400 dark:from-slate-600 dark:to-gray-700 flex items-center justify-center mb-2 ring-4 ring-slate-200 dark:ring-slate-800 shadow-lg">
                    <Medal className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center mb-2">
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">🥈</div>
                    <div className="text-sm font-semibold max-w-[100px] break-words" title={rankings[1]?.nickname}>{rankings[1]?.nickname}</div>
                    <div className="text-lg font-bold text-slate-600 dark:text-slate-400">{rankings[1]?.score}%</div>
                  </div>
                  <div className="w-full h-20 bg-gradient-to-t from-slate-300/80 to-slate-200/80 dark:from-slate-700/80 dark:to-slate-600/80 rounded-t-lg border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-600 dark:text-slate-300">2</span>
                  </div>
                </motion.div>

                {/* 第一名 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center flex-1"
                >
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-500 mb-1 mx-auto" />
                  </motion.div>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 flex items-center justify-center mb-2 ring-4 ring-yellow-300 dark:ring-yellow-600 shadow-xl shadow-yellow-400/50">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-center mb-2">
                    <div className="text-xs font-bold text-yellow-600 dark:text-yellow-400 mb-1">👑 冠军</div>
                    <div className="text-sm font-bold max-w-[110px] break-words" title={rankings[0]?.nickname}>{rankings[0]?.nickname}</div>
                    <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{rankings[0]?.score}%</div>
                  </div>
                  <div className="w-full h-28 bg-gradient-to-t from-yellow-400/80 to-amber-300/80 dark:from-yellow-600/80 dark:to-amber-500/80 rounded-t-lg border-2 border-yellow-400 dark:border-yellow-600 flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-yellow-700 dark:text-yellow-200">1</span>
                  </div>
                </motion.div>

                {/* 第三名 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center flex-1"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 dark:from-orange-600 dark:to-amber-700 flex items-center justify-center mb-2 ring-4 ring-orange-200 dark:ring-orange-800 shadow-lg">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-center mb-2">
                    <div className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-1">🥉</div>
                    <div className="text-sm font-semibold max-w-[100px] break-words" title={rankings[2]?.nickname}>{rankings[2]?.nickname}</div>
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{rankings[2]?.score}%</div>
                  </div>
                  <div className="w-full h-16 bg-gradient-to-t from-orange-300/80 to-amber-200/80 dark:from-orange-700/80 dark:to-amber-600/80 rounded-t-lg border-2 border-orange-300 dark:border-orange-600 flex items-center justify-center">
                    <span className="text-xl font-bold text-orange-600 dark:text-orange-300">3</span>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
              <div className="flex items-center gap-4">
                <span className="w-8 text-center">排名</span>
                <span className="w-24">昵称</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="flex items-center gap-1">正确率</span>
                <span className="flex items-center gap-1 w-20 justify-end">用时</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">加载中...</div>
            ) : rankings.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">暂无记录</div>
            ) : (
              <div className="divide-y divide-border/50">
                {rankings.map((record, index) => {
                  const isCurrentUser = record.device_id === userInfo.deviceId;
                  const rankStyle = getRankStyle(index);
                  const isTopThree = index < 3;

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={`${record.device_id}-${record.created_at}`}
                      className={`flex items-center justify-between p-4 transition-all duration-300 relative overflow-hidden ${
                        rankStyle.bgClass || (isCurrentUser ? "bg-primary/10" : "hover:bg-secondary/20")
                      } ${isTopThree ? "my-2 rounded-xl" : ""}`}
                    >
                      {/* 第一名添加闪光效果 */}
                      {index === 0 && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/20 to-transparent dark:via-yellow-400/10"
                          animate={{
                            x: ["-100%", "100%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatDelay: 2,
                          }}
                        />
                      )}

                      <div className="flex items-center gap-4 z-10">
                        <div className="flex flex-col items-center gap-1">
                          {rankStyle.icon ? (
                            <div className={`flex items-center justify-center ${rankStyle.textClass}`}>
                              {rankStyle.icon}
                            </div>
                          ) : (
                            <span className={`w-8 text-center font-bold ${rankStyle.textClass}`}>
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-medium break-words ${isCurrentUser ? "text-primary font-bold" : ""} ${isTopThree ? "text-base" : ""}`}
                              title={record.nickname}
                            >
                              {record.nickname}
                            </span>
                            {isCurrentUser && <span className="text-[10px] bg-primary/20 px-1.5 py-0.5 rounded text-primary">我</span>}
                            {rankStyle.badge && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${rankStyle.badgeClass}`}>
                                {rankStyle.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground">{formatDate(record.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 z-10">
                        <span className={`font-bold text-lg w-12 text-right ${isTopThree ? rankStyle.textClass : ""}`}>
                          {record.score}%
                        </span>
                        <span className="text-xs text-muted-foreground w-20 text-right">{formatDuration(record.duration_ms)}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground p-4">
          仅显示前 50 名记录
        </div>
      </div>
    </div>
  )
}

