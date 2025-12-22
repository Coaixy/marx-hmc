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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-500" />
            全新版本上线啦！
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            我们已全面升级刷题助手！
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
            <p>🚀 <strong>新增题库</strong>：现已上线<b>临床生物化学</b>题库。</p>
            <p>📖 <strong>背题模式</strong>：顺序刷题升级为背题模式，直接查看答案，高效记忆。</p>
            <p>📊 <strong>独立进度管理</strong>：各科目错题、进度互不干扰。</p>
            <p>祝大家复习顺利，逢考必过！</p>
          </div>
          
          <div className="relative w-full h-[300px] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
            <Image
              src="/IMG_1353.JPG" 
              alt="Announcement Detail"
              fill
              className="object-contain"
            />
          </div>
        </div>
          
        <DialogFooter>
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            我知道了
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
