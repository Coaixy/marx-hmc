"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { QuestionCard } from "@/components/features/exam/question-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getExamQuestions } from "@/lib/question-utils"
import { storage } from "@/lib/storage"
import { ChevronLeft, Home, Share2 } from "lucide-react"
import { toPng } from "html-to-image"
import type { SingleChoiceQuestion, MultipleChoiceQuestion, TrueFalseQuestion, MatchingQuestion } from "@/lib/question-data"
import type { AnswerRecord } from "@/lib/storage"
import type { ExamQuestionWithIndex } from "@/lib/question-utils"
import { AnswerSheet } from "@/components/features/exam/answer-sheet"
import { useSubject } from "@/components/providers/subject-provider"

export default function ExamPage() {
  const { subjectId, subject } = useSubject()
  const [examStarted, setExamStarted] = useState(false)
  const [examData, setExamData] = useState<{ singleQuestions: ExamQuestionWithIndex[]; multipleQuestions: ExamQuestionWithIndex[]; trueFalseQuestions: ExamQuestionWithIndex[]; matchingQuestions: ExamQuestionWithIndex[] } | null>(null)
  const [currentPhase, setCurrentPhase] = useState<"single" | "multiple" | "trueFalse" | "matching">("single")
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>()
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Map<string, string>>(new Map())
  const [showResult, setShowResult] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0)
  const [startTime, setStartTime] = useState<number>(0)
  const resultRef = useRef<HTMLDivElement>(null)
  const shareRef = useRef<HTMLDivElement>(null)
  const [sharing, setSharing] = useState(false)

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
    setStartTime(Date.now())

    // Determine start phase
    if (data.singleQuestions.length > 0) setCurrentPhase("single")
    else if (data.multipleQuestions.length > 0) setCurrentPhase("multiple")
    else if (data.trueFalseQuestions.length > 0) setCurrentPhase("trueFalse")
    else if (data.matchingQuestions.length > 0) setCurrentPhase("matching")

    setQuestionIndex(0)
  }

  const currentQuestion = examData
    ? currentPhase === "single"
      ? examData.singleQuestions[questionIndex]?.question
      : currentPhase === "multiple"
        ? examData.multipleQuestions[questionIndex]?.question
        : currentPhase === "trueFalse"
          ? examData.trueFalseQuestions[questionIndex]?.question
          : examData.matchingQuestions[questionIndex]?.question
    : null

  const totalSingle = examData?.singleQuestions.length || 0
  const totalMultiple = examData?.multipleQuestions.length || 0
  const totalTrueFalse = examData?.trueFalseQuestions.length || 0
  const totalMatching = examData?.matchingQuestions.length || 0

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
        } else if (totalMatching > 0) {
          setCurrentPhase("matching")
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
        } else if (totalMatching > 0) {
          setCurrentPhase("matching")
          setQuestionIndex(0)
        } else {
          finishExam()
        }
      }
    } else if (currentPhase === "trueFalse") {
      if (questionIndex + 1 < totalTrueFalse) {
        setQuestionIndex(questionIndex + 1)
      } else {
        // Try move to matching
        if (totalMatching > 0) {
          setCurrentPhase("matching")
          setQuestionIndex(0)
        } else {
          finishExam()
        }
      }
    } else if (currentPhase === "matching") {
      if (questionIndex + 1 < totalMatching) {
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
    remaining -= totalTrueFalse

    if (remaining < totalMatching) {
      setCurrentPhase("matching")
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
    examData.singleQuestions.forEach(({ question: q, originalIndex }, idx) => {
      const key = `single-${idx}`
      const userAnswer = answers.get(key) || ""
      const isCorrect = userAnswer === q.答案
      if (!isCorrect) {
        incorrectCount++
        results.push({
          id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
          questionIndex: originalIndex,
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
    examData.multipleQuestions.forEach(({ question: q, originalIndex }, idx) => {
      const key = `multiple-${idx}`
      const userAnswer = answers.get(key) || ""
      const isCorrect = userAnswer === q.答案
      if (!isCorrect) {
        incorrectCount++
        results.push({
          id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
          questionIndex: originalIndex,
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
    examData.trueFalseQuestions.forEach(({ question: q, originalIndex }, idx) => {
      const key = `trueFalse-${idx}`
      const userAnswer = answers.get(key) || ""
      const isCorrect = userAnswer === q.答案
      if (!isCorrect) {
        incorrectCount++
        results.push({
          id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
          questionIndex: originalIndex,
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

    // Matching answers
    examData.matchingQuestions.forEach(({ question: q, originalIndex }, idx) => {
      const key = `matching-${idx}`
      const userAnswer = answers.get(key) || ""
      const isCorrect = userAnswer === q.答案
      if (!isCorrect) {
        incorrectCount++
        results.push({
          id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
          questionIndex: originalIndex,
          type: "matching" as const,
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
    const totalQuestions = totalSingle + totalMultiple + totalTrueFalse + totalMatching
    const accuracy = Math.round((correctCount / totalQuestions) * 100)
    const durationMs = Date.now() - startTime

    storage.saveExamRecord(subjectId, {
      id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
      totalQuestions,
      correctAnswers: correctCount,
      accuracy,
      timestamp: Date.now(),
    })

    // Upload to database
    const userInfo = storage.getUserInfo()
    fetch('/api/exam/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: userInfo.deviceId,
        nickname: userInfo.nickname,
        examType: subjectId,
        score: accuracy,
        durationMs,
      }),
    }).catch(err => console.error('Failed to upload exam record:', err))

    setWrongAnswerCount(incorrectCount)
    setShowResult(true)
  }

  const getPhaseProgress = (phase: "single" | "multiple" | "trueFalse" | "matching", total: number) => {
    if (total === 0) return 0
    if (currentPhase === phase) {
      return Math.min(questionIndex + 1, total)
    }
    const order = ["single", "multiple", "trueFalse", "matching"]
    if (order.indexOf(currentPhase) > order.indexOf(phase)) {
      return total
    }
    return 0
  }

  const handleShareResult = async () => {
    // Generate image from the hidden premium card
    if (!shareRef.current) return
    setSharing(true)

    try {
      const element = shareRef.current

      const dataUrl = await toPng(element, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        // No filter needed as we design the share card specifically for sharing
      })

      // Convert dataUrl to blob for sharing
      const res = await fetch(dataUrl)
      const blob = await res.blob()

      const filename = `exam-result-${subject?.id}-${Date.now()}.png`
      const file = new File([blob], filename, { type: 'image/png' })

      const totalQ = totalSingle + totalMultiple + totalTrueFalse + totalMatching
      const currentCorrectCount = totalQ - wrongAnswerCount

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: '我的考试成绩',
            text: `我在${subject?.name}模拟考试中获得了${Math.round((currentCorrectCount / totalQ) * 100)}%的正确率！`,
          })
        } catch (err) {
          console.error('Share failed:', err)
        }
      } else {
        // Fallback to download
        const link = document.createElement("a")
        link.href = dataUrl
        link.download = filename
        link.click()
      }
      setSharing(false)

    } catch (err) {
      console.error("Failed to generate image:", err)
      setSharing(false)
    }
  }

  if (!mounted) return null

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-transparent p-4 flex items-center">
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
                  <li>• 单选题：根据题库随机抽取 (上限50题)</li>
                  <li>• 多选题：根据题库随机抽取 (上限20题)</li>
                  <li>• 判断题：根据题库随机抽取 (上限20题)</li>
                  <li>• 匹配题：根据题库随机抽取 (上限10题)</li>
                  <li>• 采用加强随机算法，每次题目均不同</li>
                  <li className="text-xs italic pt-1 text-muted-foreground/80">*实际出题数量取决于题库当前拥有的题目总量</li>
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
    const totalQuestions = totalSingle + totalMultiple + totalTrueFalse + totalMatching
    const totalCorrect = totalQuestions - wrongAnswerCount
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    const userInfo = storage.getUserInfo()

    return (
      <div className="min-h-screen bg-transparent p-4 flex items-center">
        <div className="max-w-md mx-auto w-full">
          {/* Visible Result Card */}
          <Card ref={resultRef} className="bg-background">
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

              <div className="p-3 bg-secondary/20 rounded-lg space-y-2">
                <p className="text-xs font-medium text-muted-foreground">你的昵称 (将显示在排行榜):</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={userInfo.nickname}
                    className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    onBlur={(e) => {
                      if (e.target.value && e.target.value !== userInfo.nickname) {
                        const newNickname = e.target.value;
                        storage.updateUserInfo({ nickname: newNickname });

                        // Sync to database
                        fetch('/api/user/update-nickname', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            deviceId: userInfo.deviceId,
                            nickname: newNickname,
                          }),
                        }).catch(err => console.error('Failed to sync nickname to database:', err))
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button onClick={handleShareResult} variant="outline" className="w-full gap-2" disabled={sharing}>
                  <Share2 className="w-4 h-4" />
                  {sharing ? "生成中..." : "分享成绩单"}
                </Button>

                <Link href="/ranking" className="block">
                  <Button variant="default" className="w-full">
                    查看排行榜
                  </Button>
                </Link>
                <Link href="/errors" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    查看错题
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="ghost" className="w-full">返回首页</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Hidden Premium Share Card (Rendered off-screen) */}
          <div className="fixed left-[-9999px] top-[-9999px]">
            <div
              ref={shareRef}
              className="w-[375px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white"
              style={{
                fontFamily: '"Noto Sans SC", sans-serif',
              }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-xl font-bold opacity-90">模拟考试成绩单</h2>
                  <h1 className="text-2xl font-black">{subject?.name}</h1>
                  <p className="text-sm opacity-70">{new Date().toLocaleDateString()}</p>
                </div>

                <div className="text-center py-8 relative">
                  <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl transform scale-75"></div>
                  <span className="relative z-10 text-8xl font-black tracking-tighter drop-shadow-lg">
                    {accuracy}
                    <span className="text-4xl text-white/80">%</span>
                  </span>
                  <p className="relative z-10 text-lg font-medium mt-2 bg-white/20 inline-block px-4 py-1 rounded-full">正确率</p>
                </div>

                <div className="grid grid-cols-2 gap-4 my-8">
                  <div className="bg-white/10 rounded-xl p-4 text-center border border-white/10">
                    <p className="text-3xl font-bold text-green-300">{totalCorrect}</p>
                    <p className="text-xs opacity-70">答对题目</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center border border-white/10">
                    <p className="text-3xl font-bold text-red-300">{wrongAnswerCount}</p>
                    <p className="text-xs opacity-70">答错题目</p>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-6 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-xs opacity-60">考生</p>
                      <p className="font-bold text-lg">{userInfo.nickname}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-60">耗时</p>
                      <p className="font-bold text-lg">
                        {Math.floor((Date.now() - startTime) / 60000)}m
                        {Math.floor(((Date.now() - startTime) % 60000) / 1000)}s
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center opacity-60 text-xs">
                <p>Powered by Marix</p>
                <p>扫码挑战我的成绩</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return null
  }

  const currentNumber = currentPhase === "single" ? questionIndex + 1 : currentPhase === "multiple" ? totalSingle + questionIndex + 1 : currentPhase === "trueFalse" ? totalSingle + totalMultiple + questionIndex + 1 : totalSingle + totalMultiple + totalTrueFalse + questionIndex + 1
  const totalQuestions = totalSingle + totalMultiple + totalTrueFalse + totalMatching

  const answeredIndices = new Set<number>()
  answers.forEach((_, key) => {
    const [phase, idxStr] = key.split('-')
    const idx = parseInt(idxStr)
    let globalIndex = idx
    if (phase === "multiple") globalIndex += totalSingle
    if (phase === "trueFalse") globalIndex += totalSingle + totalMultiple
    if (phase === "matching") globalIndex += totalSingle + totalMultiple + totalTrueFalse
    answeredIndices.add(globalIndex)
  })

  return (
    <div className="min-h-screen bg-transparent p-4 pb-48">
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
          <div className="grid grid-cols-4 gap-2 text-sm mb-2">
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
            <span>
              匹配题：{getPhaseProgress("matching", totalMatching)}/{totalMatching}
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
            showComments={false}
          />
        </div>

        {/* Controls */}
        <div className="fixed bottom-24 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent max-w-md mx-auto pointer-events-none z-40">
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
