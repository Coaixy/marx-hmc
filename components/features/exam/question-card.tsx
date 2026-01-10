"use client"

import React, { useMemo, useState } from "react"
import type { SingleChoiceQuestion, MultipleChoiceQuestion, TrueFalseQuestion, MatchingQuestion } from "@/lib/question-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { highlightNegativeKeywords, NEGATIVE_KEYWORDS, parseMatchingOptions } from "@/lib/utils"
import { Share2, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { AiExplanation } from "@/components/features/exam/ai-explanation"
import { QuestionComments } from "@/components/features/exam/question-comments"

interface QuestionCardProps {
  question: SingleChoiceQuestion | MultipleChoiceQuestion | TrueFalseQuestion | MatchingQuestion
  questionNumber: number
  totalQuestions: number
  type: "single" | "multiple" | "trueFalse" | "matching"
  onAnswerSelect: (answer: string) => void
  selectedAnswer?: string
  submitted?: boolean
  showComments?: boolean
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  type,
  onAnswerSelect,
  selectedAnswer,
  submitted = false,
  showComments = true,
}) => {
  const [copied, setCopied] = useState(false)

  const parsedMatchingOptions = useMemo(() => {
    if (type === "matching") {
      return parseMatchingOptions((question as MatchingQuestion).选项)
    }
    return {}
  }, [question, type])

  const options = useMemo(() => {
    if (type === "trueFalse") return ["A", "B"]

    if (type === "matching") {
      return Object.keys(parsedMatchingOptions).sort()
    }

    // Generate options dynamically (A, B, C, D, E, F...)
    // Checks which keys exist in the question object
    const possibleOptions = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
    return possibleOptions.filter(opt => {
      const val = (question as any)[opt]
      return typeof val === "string" && val.trim().length > 0
    })
  }, [type, question, parsedMatchingOptions])

  const normalizedCorrectAnswer = useMemo(() => {
    if (type !== 'trueFalse') return question.答案;
    if (question.答案 === '√' || question.答案 === '正确') return 'A';
    if (question.答案 === '×' || question.答案 === '错误') return 'B';
    return question.答案;
  }, [type, question.答案]);

  const isCorrect = useMemo(() => {
    if (type === 'multiple') {
      return selectedAnswer === normalizedCorrectAnswer
    }
    // For true/false, single choice and matching
    // If selected answer is the raw answer (like "√"), normalize it for comparison
    let normalizedSelected = selectedAnswer;
    if (type === 'trueFalse') {
      if (selectedAnswer === '√' || selectedAnswer === '正确') normalizedSelected = 'A';
      else if (selectedAnswer === '×' || selectedAnswer === '错误') normalizedSelected = 'B';
    }

    return normalizedSelected === normalizedCorrectAnswer
  }, [selectedAnswer, normalizedCorrectAnswer, type])

  const showResultFeedback = submitted && selectedAnswer

  const getOptionStyle = (option: string) => {
    let isSelected = false;

    if (type === "multiple") {
      isSelected = selectedAnswer?.includes(option) || false;
    } else if (type === "trueFalse") {
      // Handle cases where selectedAnswer might be passed as "√" (from search page) or "A" (from user click)
      if (selectedAnswer === '√' || selectedAnswer === '正确') isSelected = option === 'A';
      else if (selectedAnswer === '×' || selectedAnswer === '错误') isSelected = option === 'B';
      else isSelected = selectedAnswer === option;
    } else {
      isSelected = selectedAnswer === option;
    }

    const isCorrectOption = normalizedCorrectAnswer.includes(option)

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

  const renderHighlightedText = (text: string) => {
    if (!text) return ""
    const parts = highlightNegativeKeywords(text)

    if (typeof parts === "string") return parts

    return parts.map((part, i) =>
      NEGATIVE_KEYWORDS.includes(part) ? (
        <span key={i} className="text-red-500 font-bold underline decoration-2 underline-offset-2">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  const getQuestionTypeLabel = () => {
    switch (type) {
      case "single": return "单选题"
      case "multiple": return "多选题"
      case "trueFalse": return "判断题"
      case "matching": return "匹配题"
      default: return ""
    }
  }

  const generateShareText = () => {
    let text = `【${getQuestionTypeLabel()}】\n\n`
    text += `题目：${question.题干}\n\n`

    // 添加选项
    if (type === "trueFalse") {
      text += `A. √\nB. ×\n\n`
    } else if (type === "matching") {
      text += `选项：\n`
      options.forEach(opt => {
        text += `${opt}. ${parsedMatchingOptions[opt]}\n`
      })
      text += `\n`
    } else {
      options.forEach(opt => {
        const optionText = (question as any)[opt]
        if (optionText) {
          text += `${opt}. ${getOptionText(optionText, opt)}\n`
        }
      })
      text += `\n`
    }

    // 添加答案
    text += `正确答案：${question.答案}\n`

    return text
  }

  const handleCopyText = async () => {
    try {
      const text = generateShareText()
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("题目已复制到剪贴板")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("复制失败:", error)
      toast.error("复制失败，请重试")
    }
  }

  const handleShare = async () => {
    const text = generateShareText()

    // 尝试使用 Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${getQuestionTypeLabel()} - 第${questionNumber}题`,
          text: text,
        })
        toast.success("分享成功")
      } catch (error) {
        // 用户取消分享或不支持
        if ((error as Error).name !== "AbortError") {
          console.error("分享失败:", error)
        }
      }
    } else {
      // 降级到复制
      handleCopyText()
    }
  }

  return (
    <Card className="w-full border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {getQuestionTypeLabel()} {questionNumber}
              /{totalQuestions}
            </CardTitle>
            {type !== "trueFalse" && (
              <p className="text-sm text-muted-foreground mt-2">
                {(question as any).章节}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {type !== "trueFalse" && type !== "matching" && (question as SingleChoiceQuestion | MultipleChoiceQuestion).难度 && (
              <span className="text-sm px-3 py-1 bg-secondary rounded-full whitespace-nowrap">
                {(question as SingleChoiceQuestion | MultipleChoiceQuestion).难度}
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  分享
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleCopyText} className="cursor-pointer gap-2">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>复制题目</span>
                    </>
                  )}
                </DropdownMenuItem>
                {navigator.share && (
                  <DropdownMenuItem onClick={handleShare} className="cursor-pointer gap-2">
                    <Share2 className="w-4 h-4" />
                    <span>分享到...</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base font-medium leading-relaxed">{renderHighlightedText(question.题干)}</p>

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
                : type === "matching"
                  ? parsedMatchingOptions[option]
                  : getOptionText(
                    (question as any)[option],
                    option
                  )}
            </button>
          ))}
        </div>

        {submitted && (
          <>
            <div
              className={`p-3 rounded-lg ${showResultFeedback
                ? isCorrect
                  ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-100"
                  : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-100"
                : "bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-100"
                }`}
            >
              {showResultFeedback && <p className="font-medium">{isCorrect ? "正确" : "错误"}</p>}
              <p className={showResultFeedback ? "text-sm mt-1" : "font-medium"}>
                正确答案：
                {type === "trueFalse"
                  ? normalizedCorrectAnswer === "A"
                    ? "√"
                    : "×"
                  : question.答案}
              </p>
            </div>
            {/* <AiExplanation 
              question={question.题干} 
              options={options.map(opt => {
                  const text = type === "trueFalse"
                    ? opt === "A" ? "正确" : "错误"
                    : type === "matching"
                      ? parsedMatchingOptions[opt]
                      : getOptionText((question as any)[opt], opt);
                  return `${opt}. ${text}`;
              })}
              answer={type === "trueFalse" 
                ? normalizedCorrectAnswer === "A" ? "正确" : "错误"
                : question.答案}
            /> */}
          </>
        )}

        {showComments && (
          <QuestionComments
            questionText={question.题干}
            questionData={question}
            questionType={type}
          />
        )}
      </CardContent>
    </Card>
  )
}
