"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSubject } from "@/components/providers/subject-provider"
import { storage } from "@/lib/storage"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import Link from "next/link"

export function UserProgress() {
  const { subjectId, subject } = useSubject()
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [examStats, setExamStats] = useState({
    bestScore: 0,
    totalExams: 0,
    hasHistory: false
  })

  useEffect(() => {
    const examRecords = storage.getExamRecords(subjectId)
    if (examRecords.length > 0) {
      setExamStats({
        bestScore: Math.max(...examRecords.map(r => r.accuracy)),
        totalExams: examRecords.length,
        hasHistory: true
      })
    } else {
      setExamStats({
        bestScore: 0,
        totalExams: 0,
        hasHistory: false
      })
    }
  }, [subjectId])

  const handleClearWrongAnswers = () => {
    storage.clearWrongAnswers(subjectId)
    setShowClearDialog(false)
  }

  return (
    <>
      <Card className="glass-card border-none h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">我的战绩</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between gap-6">
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-gradient-to-br from-amber-50/50 to-amber-100/20 dark:from-amber-950/20 dark:to-amber-900/10 rounded-2xl border border-amber-100/50 dark:border-amber-900/20 shadow-sm hover:shadow-md transition-all"
            >
              <p className="text-xs text-muted-foreground mb-1">历史最高</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {examStats.hasHistory ? examStats.bestScore : '--'}
                </p>
                <span className="text-xs text-amber-600/70">%</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-gradient-to-br from-background/80 to-secondary/30 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all"
            >
              <p className="text-xs text-muted-foreground mb-1">完成考试</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold text-foreground">
                  {examStats.totalExams}
                </p>
                <span className="text-xs text-muted-foreground">次</span>
              </div>
            </motion.div>
          </div>

          <div className="space-y-3">
            <Link href="/ranking" className="block w-full">
              <Button
                variant="ghost"
                className="w-full h-auto py-3.5 justify-start px-4 rounded-xl transition-all group hover:bg-primary/5 hover:scale-[1.01] border border-transparent hover:border-primary/10"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary mr-3 group-hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                </div>
                <div className="text-left flex-1">
                  <span className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors">查看排行榜</span>
                  <span className="block text-xs text-muted-foreground group-hover:text-primary/70 transition-colors">查看全站最高分</span>
                </div>
                <div className="text-muted-foreground/30 group-hover:translate-x-1 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </div>
              </Button>
            </Link>

            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/5 h-auto py-3.5 justify-start px-4 rounded-xl transition-all group hover:scale-[1.01] border border-transparent hover:border-destructive/10"
              onClick={() => setShowClearDialog(true)}
            >
              <div className="p-2 rounded-lg bg-destructive/10 text-destructive mr-3 group-hover:bg-destructive/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
              </div>
              <div className="text-left flex-1">
                <span className="block text-sm font-semibold">清除错题</span>
                <span className="block text-xs opacity-70">清空当前科目错题</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>确认清除错题集</DialogTitle>
            <DialogDescription>
              此操作将清空当前科目({subject?.name})所有已记录的错题，无法恢复。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)} className="rounded-xl">
              取消
            </Button>
            <Button variant="destructive" onClick={handleClearWrongAnswers} className="rounded-xl">
              确认清除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

