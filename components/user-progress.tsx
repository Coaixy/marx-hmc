"use client"

import { Trophy, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSubject } from "@/components/subject-provider"
import { storage } from "@/lib/storage"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"

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
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg">我的战绩</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between gap-6">
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-amber-50/50 dark:bg-amber-950/10 rounded-2xl border border-amber-100/50 dark:border-amber-900/20"
            >
              <p className="text-xs text-muted-foreground mb-1">历史最高</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {examStats.hasHistory ? examStats.bestScore : '--'}
                </p>
                <span className="text-xs text-amber-600/70">%</span>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-background/50 rounded-2xl border border-border/50"
            >
              <p className="text-xs text-muted-foreground mb-1">完成考试</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-foreground">
                  {examStats.totalExams}
                </p>
                <span className="text-xs text-muted-foreground">次</span>
              </div>
            </motion.div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-auto py-3 justify-start px-3 rounded-xl transition-all group"
            onClick={() => setShowClearDialog(true)}
          >
            <div className="p-2 bg-destructive/10 rounded-lg mr-3 group-hover:bg-destructive/20 transition-colors">
              <Trash2 className="w-4 h-4" />
            </div>
            <div className="text-left flex-1">
              <span className="block text-sm font-medium">清除错题</span>
              <span className="block text-xs opacity-70">清空当前科目错题</span>
            </div>
          </Button>
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

