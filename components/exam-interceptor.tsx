"use client"

import { type ReactNode } from "react"
import { ExamEndedScreen } from "@/components/exam-ended-screen"

interface ExamInterceptorProps {
  children: ReactNode
}

// 配置项：设置为 true 启用拦截，false 禁用拦截
const EXAM_ENDED = true

// 考试结束时间（可选）
const EXAM_END_DATE = new Date("2026-01-10T00:00:00")

// 考试名称（可选）
const EXAM_NAME = "2025-2026学年第一学期期末考试"

export function ExamInterceptor({ children }: ExamInterceptorProps) {
  // 如果考试已结束，显示拦截页面
  if (EXAM_ENDED) {
    return (
      <ExamEndedScreen 
        examEndDate={EXAM_END_DATE} 
        examName={EXAM_NAME}
      />
    )
  }

  // 否则正常显示内容
  return <>{children}</>
}
