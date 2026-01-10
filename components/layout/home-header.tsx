"use client"

import { Megaphone, Check, Pencil, ChevronDown } from "lucide-react"
import { SUBJECTS, type SubjectId } from "@/lib/question-data"
import { useSubject } from "@/components/providers/subject-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { storage, UserInfo } from "@/lib/storage"
import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface HomeHeaderProps {
  onAnnouncementClick: () => void
}

export function HomeHeader({ onAnnouncementClick }: HomeHeaderProps) {
  const { subjectId, setSubjectId } = useSubject()
  const [userInfo, setUserInfo] = useState<UserInfo>({ deviceId: '', nickname: '匿名用户' })
  const [isEditing, setIsEditing] = useState(false)
  const [tempNickname, setTempNickname] = useState('')

  useEffect(() => {
    const info = storage.getUserInfo()
    setUserInfo(info)
    setTempNickname(info.nickname)
  }, [])

  const handleSaveNickname = () => {
    if (tempNickname.trim() && tempNickname !== userInfo.nickname) {
      const newNickname = tempNickname.trim();
      storage.updateUserInfo({ nickname: newNickname })
      setUserInfo(prev => ({ ...prev, nickname: newNickname }))

      // Update database
      fetch('/api/user/update-nickname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: userInfo.deviceId,
          nickname: newNickname,
        }),
      }).catch(err => console.error('Failed to sync nickname to database:', err))
    }
    setIsEditing(false)
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between relative z-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4"
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              医学期末刷题
            </h1>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              v2.0
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            {isEditing ? (
              <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-1.5 shadow-sm ring-2 ring-primary/10 transition-all">
                <input
                  type="text"
                  value={tempNickname}
                  onChange={(e) => setTempNickname(e.target.value)}
                  className="bg-transparent border-none text-sm font-medium focus:outline-none w-32 text-foreground placeholder:text-muted-foreground/50"
                  placeholder="输入昵称..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveNickname()
                    if (e.key === 'Escape') {
                      setIsEditing(false)
                      setTempNickname(userInfo.nickname)
                    }
                  }}
                />
                <button
                  onClick={handleSaveNickname}
                  className="p-1 hover:bg-green-500/10 rounded-full text-green-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="group flex items-center gap-2 px-4 py-1.5 bg-secondary/40 hover:bg-secondary/60 border border-transparent hover:border-border/50 rounded-full transition-all duration-300"
              >
                <span className="text-sm text-muted-foreground">你好,</span>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{userInfo.nickname}</span>
                <Pencil className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all -ml-1 group-hover:ml-0" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-3 w-full md:w-auto"
      >
        <Select value={subjectId} onValueChange={(value) => setSubjectId(value as SubjectId)}>
          <SelectTrigger className="w-full md:w-[200px] h-11 rounded-2xl bg-secondary/30 border-border/50 backdrop-blur-sm px-4 focus:ring-primary/20 transition-all duration-300">
            <SelectValue placeholder="选择科目" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-md shadow-xl">
            {Object.values(SUBJECTS).map((sub) => (
              <SelectItem
                key={sub.id}
                value={sub.id}
                className="rounded-xl my-1 mx-1 focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2.5"
              >
                <span className="font-medium text-sm">{sub.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-xl bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-all shrink-0 border-border"
          onClick={onAnnouncementClick}
        >
          <Megaphone className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  )
}
