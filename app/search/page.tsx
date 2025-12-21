"use client"

import { useState, useMemo } from "react"
import { useSubject } from "@/components/subject-provider"
import { QuestionCard } from "@/components/question-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search as SearchIcon, ChevronLeft, Home } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import type { Question, TrueFalseQuestion, SingleChoiceQuestion, MultipleChoiceQuestion } from "@/lib/question-data"

export default function SearchPage() {
  const { subject } = useSubject()
  const [searchTerm, setSearchTerm] = useState("")

  const allQuestions = useMemo(() => {
    if (!subject?.data) return []
    const single = (subject.data.单选题 || []).map(q => ({ ...q, type: 'single' as const }))
    const multiple = (subject.data.多选题 || []).map(q => ({ ...q, type: 'multiple' as const }))
    const trueFalse = (subject.data.判断题 || []).map(q => ({ ...q, type: 'trueFalse' as const }))
    return [...single, ...multiple, ...trueFalse]
  }, [subject])

  const filteredQuestions = useMemo(() => {
    if (!searchTerm.trim()) return []
    // Split by space and filter out empty strings
    const terms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean)
    
    if (terms.length === 0) return []

    return allQuestions.filter(q => {
      // Combine title and options for search
      const searchableText = [
        q.题干,
        (q as SingleChoiceQuestion).A,
        (q as SingleChoiceQuestion).B,
        (q as SingleChoiceQuestion).C,
        (q as SingleChoiceQuestion).D
      ].filter(Boolean).join(' ').toLowerCase()

      // Check if ALL terms are present
      return terms.every(term => searchableText.includes(term))
    }).slice(0, 50) // Limit results to prevent performance issues
  }, [allQuestions, searchTerm])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900 p-4 pb-24">
      <div className="max-w-md mx-auto pt-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="font-semibold text-primary">搜题 - {subject?.name}</h1>
          </div>
          <div className="w-9" /> {/* Spacer for alignment */}
        </div>

        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="输入关键词（支持空格分隔多个关键词）..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white/80 dark:bg-slate-900/80 backdrop-blur"
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          {searchTerm && filteredQuestions.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              未找到相关题目
            </Card>
          ) : (
            filteredQuestions.map((q, idx) => (
              <QuestionCard
                key={`${q.type}-${idx}`}
                question={q}
                questionNumber={idx + 1}
                totalQuestions={filteredQuestions.length}
                type={q.type}
                onAnswerSelect={() => {}}
                selectedAnswer={q.答案}
                submitted={true}
              />
            ))
          )}
          {!searchTerm && (
            <div className="text-center text-muted-foreground text-sm pt-8">
              输入关键词开始搜索
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

