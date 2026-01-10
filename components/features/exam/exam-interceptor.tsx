"use client"

import { type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { ExamEndedScreen } from "@/components/features/exam/exam-ended-screen"

interface ExamInterceptorProps {
  children: ReactNode
}

// 配置项：设置为 true 启用拦截，false 禁用拦截
const EXAM_ENDED = true

// 考试结束时间（可选）
const EXAM_END_DATE = new Date("2026-01-10T00:00:00")

// 考试名称（可选）
const EXAM_NAME = "2025-2026学年第一学期期末考试"

// 白名单路径，即使考试结束也可以访问
const WHITELISTED_PATHS = ["/feedback", "/api"]

export function ExamInterceptor({ children }: ExamInterceptorProps) {
  const pathname = usePathname()

  // 检查当前路径是否在白名单中
  const isWhitelisted = WHITELISTED_PATHS.some(path => pathname?.startsWith(path))

  // 如果考试已结束，且当前路径不在白名单中，显示拦截页面
  if (EXAM_ENDED && !isWhitelisted) {
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
