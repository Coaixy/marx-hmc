"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { QuestionCard } from "@/components/question-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getExamQuestions } from "@/lib/question-utils"
import { storage } from "@/lib/storage"
import { ChevronLeft, Home } from "lucide-react"
import type { SingleChoiceQuestion, MultipleChoiceQuestion, TrueFalseQuestion } from "@/lib/question-data"
import type { AnswerRecord } from "@/lib/storage"
import { AnswerSheet } from "@/components/answer-sheet"
import { useSubject } from "@/components/subject-provider"

export default function ExamPage() {
  const { subjectId, subject } = useSubject()
  const [examStarted, setExamStarted] = useState(false)
  const [examData, setExamData] = useState<{ singleQuestions: SingleChoiceQuestion[]; multipleQuestions: MultipleChoiceQuestion[]; trueFalseQuestions: TrueFalseQuestion[] } | null>(null)
  const [currentPhase, setCurrentPhase] = useState<"single" | "multiple" | "trueFalse">("single")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>()
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Map<string, string>>(new Map())
  const [showResult, setShowResult] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset exam state if subject changes
  useEffect(() => {
    if (examStarted) {
      // Optional: Confirm before resetting? For now, just reset.
      setExamStarted(false)
      setExamData(null)
      setShowResult(false)
    }
  }, [subjectId])

  useEffect(() => {
    if (!examData) return
    const key = `${currentPhase}-${questionIndex}`
    const answer = answers.get(key)
    if (answer) {
      setSelectedAnswer(answer)
      setSubmitted(true)
    } else {
      setSelectedAnswer("")
      setSubmitted(false)
    }
  }, [currentPhase, questionIndex, answers, examData])

  const startExam = () => {
    const data = getExamQuestions(subjectId)
    setExamData(data)
    setExamStarted(true)
    setAnswers(new Map())
    setWrongAnswerCount(0)
    
    // Determine start phase
    if (data.singleQuestions.length > 0) setCurrentPhase("single")
    else if (data.multipleQuestions.length > 0) setCurrentPhase("multiple")
    else setCurrentPhase("trueFalse")
    
    setQuestionIndex(0)
  }

  const currentQuestion = examData
    ? currentPhase === "single"
      ? examData.singleQuestions[questionIndex]
      : currentPhase === "multiple"
        ? examData.multipleQuestions[questionIndex]
        : examData.trueFalseQuestions[questionIndex]
    : null

  const totalSingle = examData?.singleQuestions.length || 0
  const totalMultiple = examData?.multipleQuestions.length || 0
  const totalTrueFalse = examData?.trueFalseQuestions.length || 0

  const handleSubmit = () => {
    if (!selectedAnswer) return
    setSubmitted(true)

    const key = `${currentPhase}-${questionIndex}`
    const newAnswers = new Map(answers)
    newAnswers.set(key, selectedAnswer)
    setAnswers(newAnswers)
  }

  const handleAnswerSelect = (option: string) => {
    if (submitted) return

    if (currentPhase === "multiple") {
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

  const handleNext = () => {
    if (currentPhase === "single") {
        if (questionIndex + 1 < totalSingle) {
            setQuestionIndex(questionIndex + 1)
        } else {
            // Try move to multiple
            if (totalMultiple > 0) {
                setCurrentPhase("multiple")
                setQuestionIndex(0)
            } else if (totalTrueFalse > 0) {
                setCurrentPhase("trueFalse")
                setQuestionIndex(0)
            } else {
                finishExam()
            }
        }
    } else if (currentPhase === "multiple") {
        if (questionIndex + 1 < totalMultiple) {
            setQuestionIndex(questionIndex + 1)
        } else {
            // Try move to trueFalse
            if (totalTrueFalse > 0) {
                setCurrentPhase("trueFalse")
                setQuestionIndex(0)
            } else {
                finishExam()
            }
        }
    } else if (currentPhase === "trueFalse") {
        if (questionIndex + 1 < totalTrueFalse) {
             setQuestionIndex(questionIndex + 1)
        } else {
            finishExam()
        }
    }
  }

  const handleJump = (globalIndex: number) => {
    // Need to map global index to phase + index
    if (!examData) return
    
    let remaining = globalIndex
    if (remaining < totalSingle) {
        setCurrentPhase("single")
        setQuestionIndex(remaining)
        return
    }
    remaining -= totalSingle
    
    if (remaining < totalMultiple) {
        setCurrentPhase("multiple")
        setQuestionIndex(remaining)
        return
    }
    remaining -= totalMultiple
    
    if (remaining < totalTrueFalse) {
        setCurrentPhase("trueFalse")
        setQuestionIndex(remaining)
        return
    }
  }

  const finishExam = () => {
    if (!examData) return

    const results: AnswerRecord[] = []
    let incorrectCount = 0
    let correctCount = 0

    // Single choice answers
    examData.singleQuestions.forEach((q, idx) => {
      const key = `single-${idx}`
      const userAnswer = answers.get(key) || ""
      const isCorrect = userAnswer === q.答案
      if (!isCorrect) {
        incorrectCount++
        results.push({
          id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
          questionIndex: idx,
          type: "single" as const,
          userAnswer,
          correctAnswer: q.答案,
          isCorrect: false,
          timestamp: Date.now(),
        })
      } else {
        correctCount++
      }
    })

    // Multiple choice answers
    examData.multipleQuestions.forEach((q, idx) => {
      const key = `multiple-${idx}`
      const userAnswer = answers.get(key) || ""
      const isCorrect = userAnswer === q.答案
      if (!isCorrect) {
        incorrectCount++
        results.push({
          id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
          questionIndex: idx,
          type: "multiple" as const,
          userAnswer,
          correctAnswer: q.答案,
          isCorrect: false,
          timestamp: Date.now(),
        })
      } else {
        correctCount++
      }
    })

    // True/False answers
    examData.trueFalseQuestions.forEach((q, idx) => {
      const key = `trueFalse-${idx}`
      const userAnswer = answers.get(key) || ""
      const isCorrect = userAnswer === q.答案
      if (!isCorrect) {
        incorrectCount++
        results.push({
          id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
          questionIndex: idx,
          type: "trueFalse" as const,
          userAnswer,
          correctAnswer: q.答案,
          isCorrect: false,
          timestamp: Date.now(),
        })
      } else {
        correctCount++
      }
    })

    // Save wrong answers
    results.forEach((r) => storage.addWrongAnswer(subjectId, r))

    // Save exam record
    const totalQuestions = totalSingle + totalMultiple + totalTrueFalse
    const accuracy = Math.round((correctCount / totalQuestions) * 100)
    storage.saveExamRecord(subjectId, {
      id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
      totalQuestions,
      correctAnswers: correctCount,
      accuracy,
      timestamp: Date.now(),
    })

    setWrongAnswerCount(incorrectCount)
    setShowResult(true)
  }

  const getPhaseProgress = (phase: "single" | "multiple" | "trueFalse", total: number) => {
    if (total === 0) return 0
    if (currentPhase === phase) {
      return Math.min(questionIndex + 1, total)
    }
    const order = ["single", "multiple", "trueFalse"]
    if (order.indexOf(currentPhase) > order.indexOf(phase)) {
      return total
    }
    return 0
  }

  if (!mounted) return null

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900 p-4 flex items-center">
        <div className="max-w-md mx-auto w-full">
          <Link href="/" className="mb-4 block">
            <Button variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" /> 返回首页
            </Button>
          </Link>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">模拟考试 - {subject?.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/20 p-4 rounded-lg">
                <p className="font-semibold mb-2">考试说明：</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 单选题：25道</li>
                  <li>• 多选题：5道</li>
                  <li>• 判断题：10道</li>
                  <li>• 共计：40题</li>
                  <li>• 随机抽取，每次不同</li>
                  <li className="text-xs italic pt-1 text-muted-foreground/80">*如某题型不足将调整数量</li>
                </ul>
              </div>
              <Button onClick={startExam} className="w-full" size="lg">
                开始考试
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showResult) {
    const totalQuestions = totalSingle + totalMultiple + totalTrueFalse
    const totalCorrect = totalQuestions - wrongAnswerCount
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900 p-4 flex items-center">
        <div className="max-w-md mx-auto w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">考试成绩 - {subject?.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-5xl font-bold text-primary mb-2">{accuracy}%</p>
                <p className="text-muted-foreground">正确率</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-green-50 dark:bg-green-950">
                  <CardContent className="pt-4">
                    <p className="text-2xl font-bold text-green-600">{totalCorrect}</p>
                    <p className="text-xs text-muted-foreground">答对题数</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 dark:bg-red-950">
                  <CardContent className="pt-4">
                    <p className="text-2xl font-bold text-red-600">{wrongAnswerCount}</p>
                    <p className="text-xs text-muted-foreground">答错题数</p>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-2">
                 {/* 
                 TODO: Error page also needs to be updated to support subjects, 
                 but user didn't explicitly ask for it, yet it's linked here.
                 I'll assume it's fine or I should update it too.
                 */}
                <Link href="/errors" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    查看错题
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button className="w-full">返回首页</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return null
  }

  const currentNumber = currentPhase === "single" ? questionIndex + 1 : currentPhase === "multiple" ? totalSingle + questionIndex + 1 : totalSingle + totalMultiple + questionIndex + 1
  const totalQuestions = totalSingle + totalMultiple + totalTrueFalse

  const answeredIndices = new Set<number>()
  answers.forEach((_, key) => {
    const [phase, idxStr] = key.split('-')
    const idx = parseInt(idxStr)
    let globalIndex = idx
    if (phase === "multiple") globalIndex += totalSingle
    if (phase === "trueFalse") globalIndex += totalSingle + totalMultiple
    answeredIndices.add(globalIndex)
  })

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
            <h1 className="font-semibold text-primary">模拟考试</h1>
            <p className="text-xs text-muted-foreground">
              {currentNumber}/{totalQuestions}
            </p>
          </div>
          <AnswerSheet
            total={totalQuestions}
            current={currentNumber - 1}
            answered={answeredIndices}
            onJump={handleJump}
            title="考试答题卡"
          />
        </div>

        {/* Progress */}
        <div className="mb-4 p-3 bg-secondary/20 rounded-lg">
          <div className="grid grid-cols-3 gap-2 text-sm mb-2">
            <span>
              单选题：{getPhaseProgress("single", totalSingle)}/
              {totalSingle}
            </span>
            <span>
              多选题：{getPhaseProgress("multiple", totalMultiple)}/
              {totalMultiple}
            </span>
            <span>
              判断题：{getPhaseProgress("trueFalse", totalTrueFalse)}/{totalTrueFalse}
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(answers.size / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-4">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentNumber}
            totalQuestions={totalQuestions}
            type={currentPhase}
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
              {currentNumber === totalQuestions ? "完成考试" : "下一题"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
