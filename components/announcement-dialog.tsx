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
import { Megaphone } from "lucide-react"

interface AnnouncementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnnouncementDialog({ open, onOpenChange }: AnnouncementDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-500" />
            🎉 最新版本更新！
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            全新界面与功能体验，学习更高效！
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 py-2">
            <div className="text-sm text-slate-600 dark:text-slate-300 space-y-3">
              <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
                <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">📖 题库更新</p>
                <p>• <strong>新增题库</strong>：新增《临床基础检验》题库</p>
                <p>• <strong>全面适配</strong>：完美支持搜题、顺序练习、随机刷题及模拟考试</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">✨ 新界面设计</p>
                <p>• <strong>Dock 导航栏</strong>：底部悬浮胶囊导航，流畅切换动画</p>
                <p>• <strong>玻璃质感</strong>：毛玻璃效果，现代化视觉体验</p>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                <p className="font-semibold text-green-700 dark:text-green-300 mb-1">📚 背题模式增强</p>
                <p>• <strong>智能切换</strong>：可选择"背题"或"做题"模式</p>
                <p>• <strong>进度保持</strong>：记住上次浏览位置，下次继续</p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                <p className="font-semibold text-purple-700 dark:text-purple-300 mb-1">🚀 功能优化</p>
                <p>• <strong>首页模块化</strong>：搜题、考试、错题集直接入口</p>
                <p>• <strong>动画效果</strong>：流畅的页面切换与交互动画</p>
              </div>

              <p className="text-center text-slate-500 dark:text-slate-400 italic">
                🎯 让学习更智能，让刷题更高效！
              </p>
            </div>

            <div className="relative w-full h-[150px] rounded-lg overflow-hidden bg-linear-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-4xl">🚀</div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  全新体验，等你来试
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t pt-4 mt-4">
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            我知道了
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
