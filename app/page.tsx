"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getTotalQuestions } from "@/lib/question-utils"
import { storage } from "@/lib/storage"
import type { ExamRecord } from "@/lib/storage"
import Link from "next/link"

export default function Home() {
  const { single, multiple, trueFalse } = getTotalQuestions()
  const [showClearDialog, setShowClearDialog] = useState(false)

  // Get exam records
  const examRecords = storage.getExamRecords()
  const bestScore = examRecords.length > 0 ? Math.max(...examRecords.map(r => r.accuracy)) : 0
  const totalExams = examRecords.length

  const handleClearWrongAnswers = () => {
    storage.clearWrongAnswers()
    setShowClearDialog(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900">
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认清除错题集</DialogTitle>
            <DialogDescription>
              此操作将清空所有已记录的错题，无法恢复。确定要继续吗？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleClearWrongAnswers}>
              确认清除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-md mx-auto p-4 pt-8 pb-20">

        {/* Made by */}
        <Card className="mb-6 bg-secondary/10 border-secondary/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Made with ❤️ by 小奕神</p>
              <p className="text-xs text-muted-foreground">咱班级的内部刷题工具</p>
              <p className="text-xs text-muted-foreground">微信：Nine_Palace</p>
            </div>
          </CardContent>
        </Card>


        {/* Quick Actions */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">快捷功能</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => setShowClearDialog(true)}
              variant="outline"
              className="w-full justify-start text-left h-auto p-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">🗑️ 清除错题集</span>
                </div>
                <p className="text-xs text-muted-foreground">清空所有已记录的错题</p>
              </div>
            </Button>
          </CardContent>
        </Card>


        {/* Exam History */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">模拟考试记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{bestScore}%</p>
                <p className="text-xs text-muted-foreground">历史最高分</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{totalExams}</p>
                <p className="text-xs text-muted-foreground">考试次数</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats footer */}
        <Card className="bg-secondary/20 border-secondary/50">
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{single}</p>
                <p className="text-xs text-muted-foreground">单选题</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{multiple}</p>
                <p className="text-xs text-muted-foreground">多选题</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{trueFalse}</p>
                <p className="text-xs text-muted-foreground">判断题</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{single + multiple + trueFalse}</p>
                <p className="text-xs text-muted-foreground">总题数</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
