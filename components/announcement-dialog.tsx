"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Megaphone, BookOpen, Puzzle, Sparkles, Rocket } from "lucide-react"

interface AnnouncementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnnouncementDialog({ open, onOpenChange }: AnnouncementDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        {/* Decorative Header Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent pointer-events-none" />

        <DialogHeader className="p-6 pb-4 z-10">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 ring-1 ring-primary/20 shadow-sm">
            <Megaphone className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            最新动态
            <Badge variant="secondary" className="rounded-full px-2.5 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              v1.2.0
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-base pt-1 text-muted-foreground">
            我们持续优化产品体验，助你更高效地备考！
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="px-6 py-2 space-y-6 pb-6">
            
            {/* Feature 1 */}
            <div className="flex gap-4 group">
              <div className="shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center ring-1 ring-blue-100 dark:ring-blue-800 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">题库上新</h4>
                  <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 h-5 text-[10px] px-1.5">New</Badge>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
                  <p>新增 <span className="font-medium text-foreground">《细胞生物学》</span> 专项题库，包含 500+ 精选习题与详细考点解析，覆盖核心章节。</p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 group">
              <div className="shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center ring-1 ring-orange-100 dark:ring-orange-800 group-hover:scale-110 transition-transform duration-300">
                  <Puzzle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">新增题型</h4>
                  <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-800 h-5 text-[10px] px-1.5">Feature</Badge>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <p>全新支持<span className="font-medium text-foreground">匹配题</span>（连线题）练习模式，完美适配顺序练习与随机刷题场景。</p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4 group">
              <div className="shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center ring-1 ring-indigo-100 dark:ring-indigo-800 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">体验优化</h4>
                  <Badge variant="secondary" className="h-5 text-[10px] px-1.5">Optimization</Badge>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
                  <ul className="list-disc list-outside pl-3 space-y-1 marker:text-muted-foreground/50">
                    <li>优化随机算法，彻底解决题目重复问题</li>
                    <li>界面动效升级，操作更丝滑</li>
                    <li>修复了若干已知 Bug，提升稳定性</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 bg-muted/20 z-10">
          <Button className="w-full h-11 text-base font-medium shadow-lg hover:shadow-primary/25 transition-all duration-300 group" onClick={() => onOpenChange(false)}>
            <Rocket className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            开始探索
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
