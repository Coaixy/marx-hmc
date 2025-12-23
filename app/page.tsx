"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  PieChart, 
  Trophy, 
  Trash2, 
  BrainCircuit,
  BookMarked,
  Sparkles,
  ChevronDown,
  GraduationCap,
  Megaphone,
  Search,
  ClipboardList,
  AlertCircle
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getTotalQuestions } from "@/lib/question-utils"
import { storage } from "@/lib/storage"
import { useSubject } from "@/components/subject-provider"
import { SUBJECTS, type SubjectId } from "@/lib/question-data"
import { AnnouncementDialog } from "@/components/announcement-dialog"
import { cn } from "@/lib/utils"

export default function Home() {
  const { subjectId, setSubjectId, subject } = useSubject()
  const { single, multiple, trueFalse } = getTotalQuestions(subjectId)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(false) // New state
  
  const [examStats, setExamStats] = useState({
    bestScore: 0,
    totalExams: 0,
    hasHistory: false
  })

  // Auto-show announcement
  useEffect(() => {
    const hasSeen = sessionStorage.getItem("announcement_seen")
    if (!hasSeen) {
      const timer = setTimeout(() => setShowAnnouncement(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAnnouncementOpenChange = (open: boolean) => {
     setShowAnnouncement(open)
     if (!open) {
        sessionStorage.setItem("announcement_seen", "true")
     }
  }

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

  const totalQuestions = single + multiple + trueFalse

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4 md:p-8 pb-32 md:pb-32">
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认清除错题集</DialogTitle>
            <DialogDescription>
              此操作将清空当前科目({subject?.name})所有已记录的错题，无法恢复。确定要继续吗？
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
        {/* Modern Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 p-6 md:p-10">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                <Sparkles className="w-5 h-5" />
                <span>综合刷题助手</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                准备好开始学习了吗？
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-lg">
                选择一个科目，开始你的专项训练。
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-slate-200 dark:border-slate-800 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20 transition-all shrink-0"
                onClick={() => setShowAnnouncement(true)}
              >
                 <Megaphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </Button>

              <div className="flex flex-wrap p-1 bg-slate-100/80 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                {Object.values(SUBJECTS).map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSubjectId(sub.id as SubjectId)}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2",
                      subjectId === sub.id
                        ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    )}
                  >
                    {sub.id === 'marx' ? <GraduationCap className="w-4 h-4" /> : <BrainCircuit className="w-4 h-4" />}
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Announcement Dialog */}
        <AnnouncementDialog open={showAnnouncement} onOpenChange={handleAnnouncementOpenChange} />

        {/* Functional Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/search" className="group">
            <Card className="h-full hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <CardContent className="p-4 flex flex-row sm:flex-col items-center sm:justify-center text-left sm:text-center gap-4 sm:gap-3 h-full">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">搜题</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">快速查找题目</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/exam" className="group">
            <Card className="h-full hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <CardContent className="p-4 flex flex-row sm:flex-col items-center sm:justify-center text-left sm:text-center gap-4 sm:gap-3 h-full">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <ClipboardList className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">模拟考试</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">全真模拟测试</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/errors" className="group">
            <Card className="h-full hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <CardContent className="p-4 flex flex-row sm:flex-col items-center sm:justify-center text-left sm:text-center gap-4 sm:gap-3 h-full">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">错题集</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">复习易错题目</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats & Tools Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Card */}
          <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <PieChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-lg">当前科目概览</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-3xl font-bold text-slate-700 dark:text-slate-200">{totalQuestions}</span>
                  <span className="text-xs font-medium text-muted-foreground mt-1">总题数</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{single}</span>
                  <span className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 mt-1">单选题</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                  <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{multiple}</span>
                  <span className="text-xs font-medium text-indigo-600/70 dark:text-indigo-400/70 mt-1">多选题</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-violet-50 dark:bg-violet-950/20 rounded-xl border border-violet-100 dark:border-violet-900/30">
                  <span className="text-3xl font-bold text-violet-600 dark:text-violet-400">{trueFalse}</span>
                  <span className="text-xs font-medium text-violet-600/70 dark:text-violet-400/70 mt-1">判断题</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Progress / Actions */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-lg">我的战绩</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/10 rounded-lg border border-amber-100 dark:border-amber-900/20">
                  <p className="text-xs text-muted-foreground mb-1">历史最高分</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {examStats.hasHistory ? `${examStats.bestScore}%` : '--'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-muted-foreground mb-1">完成考试</p>
                  <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                    {examStats.totalExams} <span className="text-sm font-normal text-muted-foreground">次</span>
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="ghost" 
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-auto py-3 justify-start px-3 rounded-xl transition-colors"
                  onClick={() => setShowClearDialog(true)}
                >
                  <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-md mr-3">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-medium">清除错题记录</span>
                    <span className="block text-xs text-red-500/70">清空当前科目的所有错题</span>
                  </div>
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
