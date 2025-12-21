"use client"

import React, { useMemo } from "react"
import type { SingleChoiceQuestion, MultipleChoiceQuestion, TrueFalseQuestion } from "@/lib/question-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuestionCardProps {
  question: SingleChoiceQuestion | MultipleChoiceQuestion | TrueFalseQuestion
  questionNumber: number
  totalQuestions: number
  type: "single" | "multiple" | "trueFalse"
  onAnswerSelect: (answer: string) => void
  selectedAnswer?: string
  submitted?: boolean
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  type,
  onAnswerSelect,
  selectedAnswer,
  submitted = false,
}) => {
  const options = useMemo(() => {
    if (type === "trueFalse") return ["A", "B"]
    
    // Generate options dynamically (A, B, C, D, E, F...)
    // Checks which keys exist in the question object
    const possibleOptions = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
    return possibleOptions.filter(opt => {
      const val = (question as any)[opt]
      return typeof val === "string" && val.trim().length > 0
    })
  }, [type, question])

  const isCorrect = selectedAnswer === question.答案

  const getOptionStyle = (option: string) => {
    const isSelected =
      type === "multiple" ? selectedAnswer?.includes(option) : selectedAnswer === option
    const isCorrectOption = question.答案.includes(option)

    if (submitted) {
      if (isCorrectOption) {
        return "border-green-500 bg-green-50 dark:bg-green-950"
      }
      if (isSelected) {
        return "border-red-500 bg-red-50 dark:bg-red-950"
      }
      return "border-border opacity-50"
    }

    if (isSelected) {
      return "border-primary bg-primary/10"
    }
    return "border-border hover:border-primary/50"
  }

  const getOptionText = (text: string | undefined, optionLabel: string) => {
    if (!text) return ""
    // Remove "A.", "B.", "A、", "B、" etc from the start
    // Case insensitive, handles dots, pauses, and spaces
    const regex = new RegExp(`^${optionLabel}[.、\\s]+`, "i")
    return text.replace(regex, "").trim()
  }

  return (
    <Card className="w-full border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            {type === "single" ? "单选题" : type === "multiple" ? "多选题" : "判断题"} {questionNumber}
            /{totalQuestions}
          </CardTitle>
          {type !== "trueFalse" && (
            <span className="text-sm px-3 py-1 bg-secondary rounded-full">
              {(question as SingleChoiceQuestion | MultipleChoiceQuestion).难度}
            </span>
          )}
        </div>
        {type !== "trueFalse" && (
          <p className="text-sm text-muted-foreground mt-2">
            {(question as SingleChoiceQuestion | MultipleChoiceQuestion).章节}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base font-medium leading-relaxed">{question.题干}</p>

        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => !submitted && onAnswerSelect(option)}
              disabled={submitted}
              className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${getOptionStyle(
                option,
              )} ${!submitted ? "cursor-pointer" : "cursor-default"}`}
            >
              <span className="font-semibold mr-3">{option}.</span>
              {type === "trueFalse"
                ? option === "A"
                  ? "√"
                  : "×"
                : getOptionText(
                    (question as any)[option],
                    option
                  )}
            </button>
          ))}
        </div>

        {submitted && (
          <div
            className={`p-3 rounded-lg ${
              isCorrect
                ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-100"
                : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-100"
            }`}
          >
            <p className="font-medium">{isCorrect ? "正确" : "错误"}</p>
            <p className="text-sm mt-1">
              正确答案：
              {type === "trueFalse"
                ? question.答案 === "A"
                  ? "√"
                  : "×"
                : question.答案}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
