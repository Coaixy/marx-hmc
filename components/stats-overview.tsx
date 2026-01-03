"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTotalQuestions } from "@/lib/question-utils"
import { useSubject } from "@/components/subject-provider"
import { motion } from "framer-motion"

export function StatsOverview() {
  const { subjectId } = useSubject()
  const { single, multiple, trueFalse } = getTotalQuestions(subjectId)
  const totalQuestions = single + multiple + trueFalse

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <Card className="glass-card border-none">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">题库概览</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2"
        >
          <motion.div variants={item} className="flex flex-col items-center p-4 bg-background/80 rounded-2xl border border-border/50 shadow-sm transition-transform hover:scale-105">
            <span className="text-3xl font-bold text-foreground">{totalQuestions}</span>
            <span className="text-xs font-medium text-muted-foreground mt-1">总题数</span>
          </motion.div>
          
          <motion.div variants={item} className="flex flex-col items-center p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 transition-transform hover:scale-105">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{single}</span>
            <span className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 mt-1">单选题</span>
          </motion.div>
          
          <motion.div variants={item} className="flex flex-col items-center p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30 transition-transform hover:scale-105">
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{multiple}</span>
            <span className="text-xs font-medium text-indigo-600/70 dark:text-indigo-400/70 mt-1">多选题</span>
          </motion.div>
          
          <motion.div variants={item} className="flex flex-col items-center p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border border-purple-100/50 dark:border-purple-900/30 transition-transform hover:scale-105">
            <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">{trueFalse}</span>
            <span className="text-xs font-medium text-purple-600/70 dark:text-purple-400/70 mt-1">判断题</span>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

