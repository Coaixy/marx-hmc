"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { QuestionCard } from "@/components/question-card"
import { Button } from "@/components/ui/button"
import { getTotalQuestions, getSequentialQuestion } from "@/lib/question-utils"
import { storage, type RandomProgress } from "@/lib/storage"
import { ChevronLeft, Shuffle, Home, RotateCcw } from "lucide-react"
import { useSubject } from "@/components/subject-provider"

// Fisher-Yates shuffle
function shuffleArray(array: number[]) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export default function RandomPage() {
  const { subjectId, subject } = useSubject()
  const totals = getTotalQuestions(subjectId)
  const { single, multiple, trueFalse, matching } = totals
  const [mode, setMode] = useState<"single" | "multiple" | "trueFalse" | "matching">("single")
  const [currentQuestion, setCurrentQuestion] = useState<{ question: any; index: number } | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>()
  const [submitted, setSubmitted] = useState(false)
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
    
    // Try to load saved progress
    const saved = storage.getRandomProgress(subjectId)
    if (saved) {
      setMode(saved.mode)
      setCurrentQuestion(saved.currentQuestion)
      setCount(saved.count)
      setSubmitted(saved.submitted)
      setSelectedAnswer(saved.selectedAnswer || "")
      setShuffledIndices(saved.shuffledIndices || [])
      setCurrentIndex(saved.currentIndex || 0)
    } else {
      // Determine initial mode
      let initialMode: "single" | "multiple" | "trueFalse" | "matching" = "single"
      if (single === 0) {
        if (multiple > 0) initialMode = "multiple"
        else if (trueFalse > 0) initialMode = "trueFalse"
        else if (matching > 0) initialMode = "matching"
      }
      setMode(initialMode)
      
      const totalForMode = totals[initialMode === "trueFalse" ? "trueFalse" : initialMode === "matching" ? "matching" : initialMode]
      const indices = shuffleArray(Array.from({ length: totalForMode }, (_, i) => i))
      setShuffledIndices(indices)
      setCurrentIndex(0)

      const qIndex = indices[0]
      const question = getSequentialQuestion(subjectId, initialMode, qIndex)
      
      setCurrentQuestion(question ? { question, index: qIndex } : null)
      setSelectedAnswer("")
      setSubmitted(false)
      setCount(0)
    }
  }, [subjectId]) // Only re-run when subject changes

  
  // Save progress whenever it changes
  useEffect(() => {
    if (!mounted || !currentQuestion) return
    
    const progress: RandomProgress = {
      count,
      mode,
      currentQuestion,
      submitted,
      selectedAnswer,
      lastUpdated: Date.now(),
      shuffledIndices,
      currentIndex
    }
    storage.setRandomProgress(subjectId, progress)
  }, [count, mode, currentQuestion, submitted, selectedAnswer, subjectId, mounted, shuffledIndices, currentIndex])

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
      storage.addWrongAnswer(subjectId, {
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
    let nextIndex = currentIndex + 1
    let nextShuffled = shuffledIndices

    if (nextIndex >= shuffledIndices.length) {
      // Reshuffle when done
      const totalForMode = getTotalForMode()
      nextShuffled = shuffleArray(Array.from({ length: totalForMode }, (_, i) => i))
      setShuffledIndices(nextShuffled)
      nextIndex = 0
    }

    const qIndex = nextShuffled[nextIndex]
    const question = getSequentialQuestion(subjectId, mode, qIndex)

    setCurrentIndex(nextIndex)
    setCurrentQuestion(question ? { question, index: qIndex } : null)
    setSelectedAnswer("")
    setSubmitted(false)
    setCount(count + 1)
  }

  const handleRestart = () => {
    storage.clearRandomProgress(subjectId)
    const totalForMode = getTotalForMode()
    const indices = shuffleArray(Array.from({ length: totalForMode }, (_, i) => i))
    setShuffledIndices(indices)
    setCurrentIndex(0)

    const qIndex = indices[0]
    const question = getSequentialQuestion(subjectId, mode, qIndex)

    setCurrentQuestion(question ? { question, index: qIndex } : null)
    setSelectedAnswer("")
    setSubmitted(false)
    setCount(0)
  }

  const handleModeChange = (newMode: "single" | "multiple" | "trueFalse" | "matching") => {
    setMode(newMode)
    
    const totalForMode = totals[newMode === "trueFalse" ? "trueFalse" : newMode === "matching" ? "matching" : newMode]
    const indices = shuffleArray(Array.from({ length: totalForMode }, (_, i) => i))
    setShuffledIndices(indices)
    setCurrentIndex(0)

    const qIndex = indices[0]
    const question = getSequentialQuestion(subjectId, newMode, qIndex)

    setCurrentQuestion(question ? { question, index: qIndex } : null)
    setSelectedAnswer("")
    setSubmitted(false)
    // We keep the count (total questions done in random mode across modes)
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
          <div className="text-center text-muted-foreground p-8">
            暂无题目或题库为空
          </div>
        </div>
      </div>
    )
  }

  const getTotalForMode = () => {
      switch (mode) {
          case "single": return single;
          case "multiple": return multiple;
          case "trueFalse": return trueFalse;
          case "matching": return matching;
          default: return 0;
      }
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
            <h1 className="font-semibold text-primary">随机刷题 - {subject?.name}</h1>
            <p className="text-xs text-muted-foreground">已做 {count} 题</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRestart} title="重新开始">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Mode selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {single > 0 && (
            <Button
              variant={mode === "single" ? "default" : "outline"}
              size="sm"
              onClick={() => handleModeChange("single")}
              className="flex-1"
            >
              单选题
            </Button>
          )}
          {multiple > 0 && (
            <Button
              variant={mode === "multiple" ? "default" : "outline"}
              size="sm"
              onClick={() => handleModeChange("multiple")}
              className="flex-1"
            >
              多选题
            </Button>
          )}
          {trueFalse > 0 && (
            <Button
              variant={mode === "trueFalse" ? "default" : "outline"}
              size="sm"
              onClick={() => handleModeChange("trueFalse")}
              className="flex-1"
            >
              判断题
            </Button>
          )}
          {matching > 0 && (
            <Button
              variant={mode === "matching" ? "default" : "outline"}
              size="sm"
              onClick={() => handleModeChange("matching")}
              className="flex-1"
            >
              匹配题
            </Button>
          )}
        </div>

        {/* Question */}
        <div className="mb-4">
          <QuestionCard
            question={currentQuestion.question}
            questionNumber={count + 1}
            totalQuestions={getTotalForMode()}
            type={mode}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={selectedAnswer}
            submitted={submitted}
          />
        </div>

        {/* Controls */}
        <div className="fixed bottom-24 left-0 right-0 p-4 bg-gradient-to-t from-blue-50 to-transparent dark:from-slate-950 dark:to-transparent max-w-md mx-auto pointer-events-none z-40">
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
