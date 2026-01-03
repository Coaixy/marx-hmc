"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { QuestionCard } from "@/components/question-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { storage } from "@/lib/storage"
import { getQuestionBank } from "@/lib/question-data"
import { ChevronLeft, Trash2, Home } from "lucide-react"
import { useSubject } from "@/components/subject-provider"

export default function ErrorsPage() {
  const { subjectId, subject } = useSubject()
  const [wrongAnswers, setWrongAnswers] = useState(() => storage.getWrongAnswers(subjectId))
  const [selectedId, setSelectedId] = useState<string>()
  const [filter, setFilter] = useState<"all" | "single" | "multiple" | "trueFalse">("all")
  
  // Reload when subject changes
  useEffect(() => {
    const answers = storage.getWrongAnswers(subjectId)
    // Filter out invalid answers (those without valid questions)
    const validAnswers = answers.filter(answer => {
      const qContent = getQuestionContent(answer.type, answer.questionIndex)
      return qContent !== null
    })
    // If some answers were invalid, update storage
    if (validAnswers.length !== answers.length) {
      storage.clearWrongAnswers(subjectId)
      validAnswers.forEach(answer => storage.addWrongAnswer(subjectId, answer))
    }
    setWrongAnswers(validAnswers)
    setSelectedId(undefined)
  }, [subjectId])

  const filteredAnswers = wrongAnswers.filter((a) => filter === "all" || a.type === filter)
  const selectedAnswer = filteredAnswers.find((a) => a.id === selectedId)

  const bank = getQuestionBank(subjectId)
  
  const getQuestionContent = (type: string, index: number) => {
    // Add bounds checking to prevent index out of range errors
    if (index < 0) return null

    if (type === "single") {
      const questions = bank.单选题 || []
      return index < questions.length ? questions[index] : null
    }
    if (type === "multiple") {
      const questions = bank.多选题 || []
      return index < questions.length ? questions[index] : null
    }
    if (type === "trueFalse") {
        const questions = bank.判断题 || []
        const q = questions[index]
        if (!q || index >= questions.length) return null
        return {
            ...q,
            答案: q.答案 === "√" ? "A" : "B",
            A: "√",
            B: "×",
            C: "",
            D: "",
            章节: "",
            难度: ""
        }
    }
    if (type === "matching") {
      const questions = bank.匹配题 || []
      return index < questions.length ? questions[index] : null
    }
    return null
  }

  const currentQuestion = selectedAnswer ? getQuestionContent(selectedAnswer.type, selectedAnswer.questionIndex) : null

  const handleDelete = (id: string) => {
    const currentIndex = filteredAnswers.findIndex((a) => a.id === id)
    let nextId = ""
    
    if (filteredAnswers.length > 1) {
      if (currentIndex < filteredAnswers.length - 1) {
        nextId = filteredAnswers[currentIndex + 1].id
      } else {
        nextId = filteredAnswers[currentIndex - 1].id
      }
    }

    storage.removeWrongAnswer(subjectId, id)
    setWrongAnswers(storage.getWrongAnswers(subjectId))
    setSelectedId(nextId)
  }

  const handleClearAll = () => {
    if (confirm("确定要清空所有错题记录吗？")) {
      storage.clearWrongAnswers(subjectId)
      setWrongAnswers([])
      setSelectedId("")
    }
  }

  if (wrongAnswers.length === 0) {
    return (
      <div className="min-h-screen bg-transparent p-4">
        <div className="max-w-md mx-auto pt-8">
          <Link href="/">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ChevronLeft className="w-4 h-4 mr-2" /> 返回首页
            </Button>
          </Link>
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <p className="text-lg font-semibold text-muted-foreground mb-2">暂无错题记录 - {subject?.name}</p>
              <p className="text-sm text-muted-foreground">继续学习，争取全部做对！</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent p-4 pb-20">
      <div className="max-w-md mx-auto pt-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="font-semibold text-primary">错题记录 - {subject?.name}</h1>
            <p className="text-xs text-muted-foreground">{filteredAnswers.length} 道错题</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="flex-1"
          >
            全部
          </Button>
          <Button
            variant={filter === "single" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("single")}
            className="flex-1"
          >
            单选
          </Button>
          <Button
            variant={filter === "multiple" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("multiple")}
            className="flex-1"
          >
            多选
          </Button>
          <Button
            variant={filter === "trueFalse" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("trueFalse")}
            className="flex-1"
          >
            判断
          </Button>
        </div>

        {selectedId && currentQuestion ? (
          <div className="mb-4 space-y-3">
            <QuestionCard
              question={currentQuestion}
              questionNumber={filteredAnswers.findIndex((a) => a.id === selectedId) + 1}
              totalQuestions={filteredAnswers.length}
              type={selectedAnswer?.type || "single"}
              onAnswerSelect={() => {}}
              selectedAnswer={selectedAnswer?.userAnswer}
              submitted={true}
            />
            <div className="flex gap-2">
              <Button onClick={() => setSelectedId("")} variant="outline" className="flex-1">
                隐藏
              </Button>
              <Button onClick={() => handleDelete(selectedId)} variant="destructive" className="flex-1">
                <Trash2 className="w-4 h-4 mr-2" /> 删除
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            {filteredAnswers.map((answer, idx) => {
                const qContent = getQuestionContent(answer.type, answer.questionIndex)
                return (
                  <button
                    key={answer.id}
                    onClick={() => setSelectedId(answer.id)}
                    className="w-full p-3 text-left rounded-lg border border-border hover:border-primary/50 transition-colors bg-card"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {answer.type === "single" ? "单选题" : answer.type === "multiple" ? "多选题" : answer.type === "trueFalse" ? "判断题" : answer.type === "matching" ? "匹配题" : "未知题型"} {idx + 1}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {qContent?.题干 || "题目加载失败或已更新"}
                        </p>
                      </div>
                      <span className="text-xs bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-2 py-1 rounded ml-2 shrink-0">
                        错误
                      </span>
                    </div>
                  </button>
                )
            })}
          </div>
        )}

        {/* Clear all button */}
        {!selectedId && (
          <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto pointer-events-none">
            <Button
              onClick={handleClearAll}
              variant="outline"
              className="w-full text-red-600 dark:text-red-400 bg-background/80 backdrop-blur-sm pointer-events-auto shadow-sm"
            >
              清空全部错题
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

