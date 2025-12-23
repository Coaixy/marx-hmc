"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { QuestionCard } from "@/components/question-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getSequentialQuestion, getTotalQuestions } from "@/lib/question-utils"
import { storage } from "@/lib/storage"
import { ChevronLeft, ChevronRight, Home } from "lucide-react"
import { AnswerSheet } from "@/components/answer-sheet"
import { useSubject } from "@/components/subject-provider"

export default function SequentialPage() {
  const { subjectId, subject } = useSubject()
  const { single, multiple, trueFalse } = getTotalQuestions(subjectId)
  const [mode, setMode] = useState<"single" | "multiple" | "trueFalse">("single")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>()
  const [submitted, setSubmitted] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Reset or load progress when subject changes
  useEffect(() => {
    setMounted(true)
    const progress = storage.getProgress(subjectId)
    
    // Default to 'single' if available, otherwise try others
    let initialMode: "single" | "multiple" | "trueFalse" = "single"
    if (single === 0) {
      if (multiple > 0) initialMode = "multiple"
      else if (trueFalse > 0) initialMode = "trueFalse"
    }
    setMode(initialMode)

    if (initialMode === "single") {
      setQuestionIndex(progress.singleIndex)
    } else if (initialMode === "multiple") {
      setQuestionIndex(progress.multipleIndex)
    } else {
      setQuestionIndex(progress.trueFalseIndex)
    }
    
    // Reset state
    setSelectedAnswer("")
    setSubmitted(true)
  }, [subjectId, single, multiple, trueFalse])

  useEffect(() => {
    if (!mounted) return
    const progress = storage.getProgress(subjectId)
    if (mode === "single") {
      setQuestionIndex(progress.singleIndex)
    } else if (mode === "multiple") {
      setQuestionIndex(progress.multipleIndex)
    } else {
      setQuestionIndex(progress.trueFalseIndex)
    }
    setSelectedAnswer("")
    setSubmitted(true)
  }, [mode, subjectId]) // Add subjectId to dep, though managed by above effect too

  const handleAnswerSelect = (option: string) => {
    if (submitted) return

    if (mode === "multiple") {
      const currentSelected = selectedAnswer ? selectedAnswer.split("") : []
      let next: string
      if (currentSelected.includes(option)) {
        next = currentSelected.filter((o) => o !== option).sort().join("")
      } else {
        next = [...currentSelected, option].sort().join("")
      }
      setSelectedAnswer(next)
    } else {
      setSelectedAnswer(option)
    }
  }

  const saveCurrentProgress = (newIndex: number) => {
    const progress = storage.getProgress(subjectId)
    if (mode === "single") {
      progress.singleIndex = newIndex
    } else if (mode === "multiple") {
      progress.multipleIndex = newIndex
    } else {
      progress.trueFalseIndex = newIndex
    }
    progress.lastUpdated = Date.now()
    storage.setProgress(subjectId, progress)
  }

  const currentQuestion = getSequentialQuestion(subjectId, mode, questionIndex)
  const maxQuestions = mode === "single" ? single : mode === "multiple" ? multiple : trueFalse

  const handleNext = () => {
    if (questionIndex + 1 < maxQuestions) {
      const nextIndex = questionIndex + 1
      setQuestionIndex(nextIndex)
      setSelectedAnswer("")
      setSubmitted(true)
      saveCurrentProgress(nextIndex)
    }
  }

  const handlePrev = () => {
    if (questionIndex > 0) {
      const prevIndex = questionIndex - 1
      setQuestionIndex(prevIndex)
      setSelectedAnswer("")
      setSubmitted(true)
      saveCurrentProgress(prevIndex)
    }
  }

  const handleJump = (index: number) => {
    setQuestionIndex(index)
    setSelectedAnswer("")
    setSubmitted(true)
    saveCurrentProgress(index)
  }

  if (!mounted) return null

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900 p-4">
        <div className="max-w-md mx-auto pt-8">
          <Link href="/">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ChevronLeft className="w-4 h-4 mr-2" /> 返回首页
            </Button>
          </Link>
          <Card className="p-6 text-center">
            <p className="text-lg font-semibold text-muted-foreground">
              {maxQuestions === 0 ? "该题型暂无题目" : "所有题目已完成"}
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900 p-4 pb-48">
      <div className="max-w-md mx-auto pt-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="font-semibold text-primary">背题模式 - {subject?.name}</h1>
          </div>
          <AnswerSheet
            total={maxQuestions}
            current={questionIndex}
            answered={new Set(Array.from({ length: questionIndex }, (_, i) => i))}
            onJump={handleJump}
            title={`${mode === "single" ? "单选题" : mode === "multiple" ? "多选题" : "判断题"}答题卡`}
          />
        </div>

        {/* Mode selector - hide if 0 questions */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {single > 0 && (
            <Button
              variant={mode === "single" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("single")}
              className="flex-1"
            >
              单选题
            </Button>
          )}
          {multiple > 0 && (
            <Button
              variant={mode === "multiple" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("multiple")}
              className="flex-1"
            >
              多选题
            </Button>
          )}
          {trueFalse > 0 && (
            <Button
              variant={mode === "trueFalse" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("trueFalse")}
              className="flex-1"
            >
              判断题
            </Button>
          )}
        </div>

        {/* Question */}
        <div className="mb-4">
          <QuestionCard
            question={currentQuestion}
            questionNumber={questionIndex + 1}
            totalQuestions={maxQuestions}
            type={mode}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={selectedAnswer}
            submitted={submitted}
          />
        </div>

        {/* Controls */}
        <div className="space-y-3 fixed bottom-[60px] left-0 right-0 p-4 bg-gradient-to-t from-blue-50 to-transparent dark:from-slate-950 dark:to-transparent max-w-md mx-auto pointer-events-none z-40">
          <div className="flex gap-2 pointer-events-auto">
            <Button
              onClick={handlePrev}
              disabled={questionIndex === 0}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> 上一题
            </Button>
            <Button onClick={handleNext} disabled={questionIndex + 1 >= maxQuestions} className="flex-1">
              下一题 <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
