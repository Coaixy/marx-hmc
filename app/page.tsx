"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  BookOpen, 
  ClipboardList, 
  Trash2, 
  Trophy, 
  Target, 
  PieChart, 
  CheckCircle2, 
  BrainCircuit,
  History
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getTotalQuestions } from "@/lib/question-utils"
import { storage } from "@/lib/storage"

export default function Home() {
  const { single, multiple, trueFalse } = getTotalQuestions()
  const [showClearDialog, setShowClearDialog] = useState(false)
  
  // 使用 useEffect 处理客户端存储数据的获取，避免水合不匹配
  const [examStats, setExamStats] = useState({
    bestScore: 0,
    totalExams: 0,
    hasHistory: false
  })

  useEffect(() => {
    const examRecords = storage.getExamRecords()
    if (examRecords.length > 0) {
      setExamStats({
        bestScore: Math.max(...examRecords.map(r => r.accuracy)),
        totalExams: examRecords.length,
        hasHistory: true
      })
    }
  }, [])

  const handleClearWrongAnswers = () => {
    storage.clearWrongAnswers()
    setShowClearDialog(false)
    // 可以添加一个 toast 提示
  }

  const totalQuestions = single + multiple + trueFalse

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4 md:p-8 pb-32 md:pb-32">
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

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Stats & Tools Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Stats Card */}
          <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-slate-500" />
                <CardTitle className="text-lg">题库概览</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-3xl font-bold text-slate-700 dark:text-slate-200">{totalQuestions}</span>
                  <span className="text-xs text-muted-foreground mt-1">总题数</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{single}</span>
                  <span className="text-xs text-muted-foreground mt-1">单选题</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                  <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{multiple}</span>
                  <span className="text-xs text-muted-foreground mt-1">多选题</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-violet-50 dark:bg-violet-950/30 rounded-lg">
                  <span className="text-3xl font-bold text-violet-600 dark:text-violet-400">{trueFalse}</span>
                  <span className="text-xs text-muted-foreground mt-1">判断题</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Progress / Actions */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <CardTitle className="text-lg">我的战绩</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <div>
                  <p className="text-sm text-muted-foreground">历史最高分</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {examStats.hasHistory ? `${examStats.bestScore}%` : '--'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">完成考试</p>
                  <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                    {examStats.totalExams}
                  </p>
                </div>
              </div>
              
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button 
                  variant="ghost" 
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-auto py-2 justify-start"
                  onClick={() => setShowClearDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span className="text-sm">清除错题集数据</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="pt-8 text-center text-sm text-muted-foreground">
           <div className="flex items-center justify-center gap-2 mb-2">
            <BrainCircuit className="w-4 h-4" />
            <span>Made with ❤️ by 小奕神</span>
           </div>
           <p className="text-xs opacity-70">微信：Nine_Palace</p>
        </footer>
      </div>
    </main>
  )
}
