"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  PieChart, 
  Trophy, 
  Trash2, 
  BrainCircuit,
  BookMarked,
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
import { CountdownTimer } from "@/components/countdown-timer"
import { Fireworks } from "@/components/fireworks"
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4 md:p-8 pb-32 md:pb-32 relative">
      <Fireworks />
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

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Modern Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl border border-white/20 dark:border-slate-800/50 p-3 md:p-4">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                    医学期末刷题
                  </h2>
                  <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-900/30 dark:text-red-400">
                    2026 元旦快乐 🎉
                  </span>
                </div>
                <p className="text-[10px] text-blue-500/80 dark:text-blue-400 uppercase tracking-wider font-bold">Medical Exam Prep</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                {Object.values(SUBJECTS).map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSubjectId(sub.id as SubjectId)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2",
                      subjectId === sub.id
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    )}
                  >
                    {sub.id === 'marx' ? (
                      <GraduationCap className="w-4 h-4" />
                    ) : sub.id === 'law' ? (
                      <BookMarked className="w-4 h-4" />
                    ) : (
                      <BrainCircuit className="w-4 h-4" />
                    )}
                    {sub.name}
                  </button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shrink-0"
                onClick={() => setShowAnnouncement(true)}
              >
                 <Megaphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </Button>
            </div>
            
            {/* Mobile Subject Switcher */}
            <div className="sm:hidden w-full p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex overflow-x-auto no-scrollbar gap-1">
               {Object.values(SUBJECTS).map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSubjectId(sub.id as SubjectId)}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 whitespace-nowrap",
                      subjectId === sub.id
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-slate-500 dark:text-slate-400"
                    )}
                  >
                    {sub.name}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Countdown Section */}
        <CountdownTimer />

        {/* Announcement Dialog */}
        <AnnouncementDialog open={showAnnouncement} onOpenChange={handleAnnouncementOpenChange} />

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
