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
              v1.3.0
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-base pt-1 text-muted-foreground">
            我们持续优化产品体验，助你更高效地备考！
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="px-6 py-2 space-y-6 pb-6">


            {/* Feature 3 */}
            <div className="flex gap-4 group">
              <div className="shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center ring-1 ring-orange-100 dark:ring-orange-800 group-hover:scale-110 transition-transform duration-300">
                  <Puzzle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">智能检索</h4>
                  <Badge variant="default" className="bg-orange-600 hover:bg-orange-700 h-5 text-[10px] px-1.5">New</Badge>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <p>新增<span className="font-medium text-foreground">信息检索</span>功能，快速查找题目、知识点和学习资料。</p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4 group">
              <div className="shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center ring-1 ring-green-100 dark:ring-green-800 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">AI智能答疑</h4>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800 h-5 text-[10px] px-1.5">Feature</Badge>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <p>评论区接入<span className="font-medium text-foreground">AI助手</span>，实时解答学习疑问，提供个性化学习建议。</p>
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex gap-4 group">
              <div className="shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center ring-1 ring-indigo-100 dark:ring-indigo-800 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">体验优化</h4>
                  <Badge variant="secondary" className="h-5 text-[10px] px-1.5">Optimization</Badge>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
                  <ul className="list-disc list-outside pl-3 space-y-1 marker:text-muted-foreground/50">
                    <li>新增多个专项题库和考试模式</li>
                    <li>修复题目无限刷新问题，提升稳定性</li>
                    <li>优化错题本功能，学习更高效</li>
                    <li>修复评论功能，社区互动更流畅</li>
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
