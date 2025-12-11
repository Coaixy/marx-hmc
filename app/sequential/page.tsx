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

export default function SequentialPage() {
  const { single, multiple, trueFalse } = getTotalQuestions()
  const [mode, setMode] = useState<"single" | "multiple" | "trueFalse">("single")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>()
  const [submitted, setSubmitted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const progress = storage.getProgress()
    if (mode === "single") {
      setQuestionIndex(progress.singleIndex)
    } else if (mode === "multiple") {
      setQuestionIndex(progress.multipleIndex)
    } else {
      setQuestionIndex(progress.trueFalseIndex)
    }
  }, [mode])

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

  const currentQuestion = getSequentialQuestion(mode, questionIndex)
  const maxQuestions = mode === "single" ? single : mode === "multiple" ? multiple : trueFalse

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return
    setSubmitted(true)

    const isCorrect = selectedAnswer === currentQuestion.答案
    if (!isCorrect) {
      storage.addWrongAnswer({
        id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
        questionIndex,
        type: mode,
        userAnswer: selectedAnswer,
        correctAnswer: currentQuestion.答案,
        isCorrect: false,
        timestamp: Date.now(),
      })
    }
  }

  const handleNext = () => {
    if (questionIndex + 1 < maxQuestions) {
      setQuestionIndex(questionIndex + 1)
      setSelectedAnswer("")
      setSubmitted(false)

      const progress = storage.getProgress()
      if (mode === "single") {
        progress.singleIndex = Math.max(progress.singleIndex, questionIndex + 1)
      } else if (mode === "multiple") {
        progress.multipleIndex = Math.max(progress.multipleIndex, questionIndex + 1)
      } else {
        progress.trueFalseIndex = Math.max(progress.trueFalseIndex, questionIndex + 1)
      }
      storage.setProgress(progress)
    }
  }

  const handlePrev = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1)
      setSelectedAnswer("")
      setSubmitted(false)
    }
  }

  const handleJump = (index: number) => {
    setQuestionIndex(index)
    setSelectedAnswer("")
    setSubmitted(false)
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
            <p className="text-lg font-semibold text-muted-foreground">所有题目已完成</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900 p-4 pb-20">
      <div className="max-w-md mx-auto pt-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="font-semibold text-primary">顺序刷题</h1>
          </div>
          <AnswerSheet
            total={maxQuestions}
            current={questionIndex}
            answered={new Set(Array.from({ length: questionIndex }, (_, i) => i))}
            onJump={handleJump}
            title={`${mode === "single" ? "单选题" : mode === "multiple" ? "多选题" : "判断题"}答题卡`}
          />
        </div>

        {/* Mode selector */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            variant={mode === "single" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("single")}
            className="flex-1"
          >
            单选题
          </Button>
          <Button
            variant={mode === "multiple" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("multiple")}
            className="flex-1"
          >
            多选题
          </Button>
          <Button
            variant={mode === "trueFalse" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("trueFalse")}
            className="flex-1"
          >
            判断题
          </Button>
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
        <div className="space-y-3 fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-blue-50 to-transparent dark:from-slate-950 dark:to-transparent max-w-md mx-auto pointer-events-none z-50">
          {!submitted ? (
            <Button onClick={handleSubmit} disabled={!selectedAnswer} className="w-full pointer-events-auto" size="lg">
              提交答案
            </Button>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  )
}
