"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnswerSheetProps {
  total: number
  current: number // 0-based index
  answered: Set<number>
  onJump: (index: number) => void
  trigger?: React.ReactNode
  title?: string
}

export function AnswerSheet({ 
  total, 
  current, 
  answered, 
  onJump, 
  trigger,
  title = "答题卡" 
}: AnswerSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <LayoutGrid className="h-5 w-5" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-[10px]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <div className="flex gap-4 text-xs text-muted-foreground justify-center pt-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span>当前</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-secondary rounded-full" />
              <span>已答</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-input rounded-full" />
              <span>未答</span>
            </div>
          </div>
        </SheetHeader>
        <ScrollArea className="h-full pb-10">
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-3 p-4">
            {Array.from({ length: total }).map((_, i) => {
              const isCurrent = i === current
              const isAnswered = answered.has(i)
              
              return (
                <Button
                  key={i}
                  variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                  className={cn(
                    "h-10 w-full p-0 font-normal",
                    isCurrent && "ring-2 ring-primary ring-offset-2"
                  )}
                  onClick={() => {
                    onJump(i)
                    setOpen(false)
                  }}
                >
                  {i + 1}
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
