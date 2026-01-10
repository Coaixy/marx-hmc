import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Noto_Sans_SC } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { BottomNavigation } from "@/components/layout/bottom-navigation"
import { ExamInterceptor } from "@/components/features/exam/exam-interceptor"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _notoChinese = Noto_Sans_SC({ subsets: ["latin"] })

import { SubjectProvider } from "@/components/providers/subject-provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "综合刷题助手",
  description: "高效学习，轻松备考",
  generator: "Coaixy@outlookc.om",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${_geist.className} ${_geistMono.className} ${_notoChinese.className} font-sans antialiased min-h-screen pb-20`}>
        <SubjectProvider>
          <ExamInterceptor>
            {children}
            <BottomNavigation />
            <Toaster />
          </ExamInterceptor>
        </SubjectProvider>
        <Analytics />
      </body>
    </html>
  )
}
