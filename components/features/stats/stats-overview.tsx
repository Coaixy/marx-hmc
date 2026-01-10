"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTotalQuestions } from "@/lib/question-utils"
import { useSubject } from "@/components/providers/subject-provider"
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
          <motion.div variants={item} className="group flex flex-col items-center p-4 bg-gradient-to-br from-background/80 to-secondary/30 rounded-2xl border border-border/50 shadow-sm transition-all hover:scale-105 hover:shadow-md hover:border-primary/20">
            <span className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">{totalQuestions}</span>
            <span className="text-xs font-medium text-muted-foreground mt-1">总题数</span>
          </motion.div>

          <motion.div variants={item} className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50/50 to-blue-100/20 dark:from-blue-950/20 dark:to-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 transition-all hover:scale-105 hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 hover:shadow-lg">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{single}</span>
            <span className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 mt-1">单选题</span>
          </motion.div>

          <motion.div variants={item} className="flex flex-col items-center p-4 bg-gradient-to-br from-indigo-50/50 to-indigo-100/20 dark:from-indigo-950/20 dark:to-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30 transition-all hover:scale-105 hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/20 hover:shadow-lg">
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{multiple}</span>
            <span className="text-xs font-medium text-indigo-600/70 dark:text-indigo-400/70 mt-1">多选题</span>
          </motion.div>

          <motion.div variants={item} className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50/50 to-purple-100/20 dark:from-purple-950/20 dark:to-purple-900/10 rounded-2xl border border-purple-100/50 dark:border-purple-900/30 transition-all hover:scale-105 hover:shadow-purple-100/50 dark:hover:shadow-purple-900/20 hover:shadow-lg">
            <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">{trueFalse}</span>
            <span className="text-xs font-medium text-purple-600/70 dark:text-purple-400/70 mt-1">判断题</span>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

