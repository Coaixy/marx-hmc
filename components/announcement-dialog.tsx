"use client"

import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Megaphone, BookOpen, Puzzle, Sparkles } from "lucide-react"

interface AnnouncementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnnouncementDialog({ open, onOpenChange }: AnnouncementDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] flex flex-col glass-card">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-primary" />
            🎉 最新更新
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            持续优化，助你高效备考！
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 py-4">
            <div className="text-sm text-slate-600 dark:text-slate-300 space-y-3">
              
              <div className="bg-primary/5 dark:bg-primary/10 p-3 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <p className="font-semibold text-primary">题库上新</p>
                </div>
                <p>• 新增 <strong>《细胞生物学》</strong> 题库</p>
                <p>• 包含丰富的章节练习与考点解析</p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-2">
                    <Puzzle className="w-4 h-4 text-orange-600" />
                    <p className="font-semibold text-orange-700 dark:text-orange-300">新增题型</p>
                </div>
                <p>• 现已支持 <strong>匹配题</strong> 练习</p>
                <p>• 适配顺序练习、随机刷题模式</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-slate-600" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">功能优化</p>
                </div>
                <p>• 优化<strong>随机刷题</strong>逻辑：采用 Fisher-Yates 算法实现真随机排序，彻底解决题目重复出现的问题</p>
                <p>• 界面细节优化，体验更流畅</p>
                <p>• 修复已知问题，提升稳定性</p>
              </div>

            </div>
          </div>
        </div>

        <DialogFooter className="shrink-0 pt-2">
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            开始学习
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
