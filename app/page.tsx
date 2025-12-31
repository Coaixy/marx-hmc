"use client"

import { useSubject } from "@/components/subject-provider"
import { SUBJECTS, type SubjectId } from "@/lib/question-data"
import { getTotalQuestions } from "@/lib/question-utils"
import { storage } from "@/lib/storage"
import { AnnouncementDialog } from "@/components/announcement-dialog"
import { CountdownTimer } from "@/components/countdown-timer"
import { Fireworks } from "@/components/fireworks"
import { HomeHeader } from "@/components/home-header"
import { StatsOverview } from "@/components/stats-overview"
import { UserProgress } from "@/components/user-progress"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const { subjectId } = useSubject()
  const [showAnnouncement, setShowAnnouncement] = useState(false)

  // Auto-show announcement
  useEffect(() => {
    const hasSeen = sessionStorage.getItem("announcement_seen")
    if (!hasSeen) {
      const timer = setTimeout(() => setShowAnnouncement(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAnnouncementOpenChange = (open: boolean) => {
     setShowAnnouncement(open)
     if (!open) {
        sessionStorage.setItem("announcement_seen", "true")
     }
  }

  return (
    <main className="min-h-screen p-4 md:p-8 pb-32 md:pb-32 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-3xl" />
         <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <Fireworks />
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <HomeHeader onAnnouncementClick={() => setShowAnnouncement(true)} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-end"
        >
          <Link href="/new-year" className="inline-block">
             <div className="group relative px-6 py-2 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden hover:scale-105 transition-transform cursor-pointer border border-primary/20 hover:border-primary/50">
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="flex items-center gap-2 relative z-10">
                 <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                   2026 New Year Countdown
                 </span>
                 <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
               </div>
             </div>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CountdownTimer />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <StatsOverview />
          </motion.div>
          
          <motion.div 
            className="h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <UserProgress />
          </motion.div>
        </div>
      </div>

      <AnnouncementDialog open={showAnnouncement} onOpenChange={handleAnnouncementOpenChange} />
    </main>
  )
}
