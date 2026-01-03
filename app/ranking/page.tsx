"use client"

import { useState, useEffect } from "react"
import { useSubject } from "@/components/subject-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Trophy, Timer, Target, User } from "lucide-react"
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
            <Trophy className="w-5 h-5 text-yellow-500" />
            {subject?.name}
          </h1>
          <div className="w-20"></div> {/* Spacer */}
        </div>

        <Card className="border-none shadow-xl bg-background/50 backdrop-blur-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
              <div className="flex items-center gap-4">
                <span className="w-8 text-center">排名</span>
                <span className="w-24">昵称</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="flex items-center gap-1"><Target className="w-3 h-3" /> 正确率</span>
                <span className="flex items-center gap-1 w-20 justify-end"><Timer className="w-3 h-3" /> 用时</span>
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
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={`${record.device_id}-${record.created_at}`}
                      className={`flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors ${
                        isCurrentUser ? "bg-primary/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 text-center font-bold ${
                          index === 0 ? "text-yellow-500 text-lg" : 
                          index === 1 ? "text-slate-400" : 
                          index === 2 ? "text-amber-600" : "text-muted-foreground"
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex flex-col">
                          <span className={`font-medium ${isCurrentUser ? "text-primary" : ""}`}>
                            {record.nickname}
                            {isCurrentUser && <span className="ml-2 text-[10px] bg-primary/20 px-1.5 py-0.5 rounded text-primary">我</span>}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{formatDate(record.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <span className="font-bold text-lg w-12 text-right">{record.score}%</span>
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

