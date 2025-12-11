"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { QuestionCard } from "@/components/question-card"
import { Button } from "@/components/ui/button"
import { getRandomQuestion, getTotalQuestions } from "@/lib/question-utils"
import { storage } from "@/lib/storage"
import { ChevronLeft, Shuffle, Home } from "lucide-react"

export default function RandomPage() {
  const { single, multiple, trueFalse } = getTotalQuestions()
  const [mode, setMode] = useState<"single" | "multiple" | "trueFalse">("single")
  const [currentQuestion, setCurrentQuestion] = useState(getRandomQuestion(mode))
  const [selectedAnswer, setSelectedAnswer] = useState<string>()
  const [submitted, setSubmitted] = useState(false)
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return
    setSubmitted(true)

    const isCorrect = selectedAnswer === currentQuestion.question.答案
    if (!isCorrect) {
      storage.addWrongAnswer({
        id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
        questionIndex: currentQuestion.index,
        type: mode,
        userAnswer: selectedAnswer,
        correctAnswer: currentQuestion.question.答案,
        isCorrect: false,
        timestamp: Date.now(),
      })
    }
  }

  const handleNext = () => {
    const next = getRandomQuestion(mode)
    setCurrentQuestion(next)
    setSelectedAnswer("")
    setSubmitted(false)
    setCount(count + 1)
  }

  const handleModeChange = (newMode: "single" | "multiple" | "trueFalse") => {
    setMode(newMode)
    const next = getRandomQuestion(newMode)
    setCurrentQuestion(next)
    setSelectedAnswer("")
    setSubmitted(false)
    setCount(0)
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
            <h1 className="font-semibold text-primary">随机刷题</h1>
            <p className="text-xs text-muted-foreground">已做 {count} 题</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Mode selector */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            variant={mode === "single" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("single")}
            className="flex-1"
          >
            单选题
          </Button>
          <Button
            variant={mode === "multiple" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("multiple")}
            className="flex-1"
          >
            多选题
          </Button>
          <Button
            variant={mode === "trueFalse" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("trueFalse")}
            className="flex-1"
          >
            判断题
          </Button>
        </div>

        {/* Question */}
        <div className="mb-4">
          <QuestionCard
            question={currentQuestion.question}
            questionNumber={count + 1}
            totalQuestions={mode === "single" ? single : mode === "multiple" ? multiple : trueFalse}
            type={mode}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={selectedAnswer}
            submitted={submitted}
          />
        </div>

        {/* Controls */}
        <div className="fixed bottom-[60px] left-0 right-0 p-4 bg-gradient-to-t from-blue-50 to-transparent dark:from-slate-950 dark:to-transparent max-w-md mx-auto pointer-events-none z-40">
          {!submitted ? (
            <Button onClick={handleSubmit} disabled={!selectedAnswer} className="w-full pointer-events-auto" size="lg">
              提交答案
            </Button>
          ) : (
            <Button onClick={handleNext} className="w-full pointer-events-auto" size="lg">
              <Shuffle className="w-4 h-4 mr-2" /> 下一题
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
