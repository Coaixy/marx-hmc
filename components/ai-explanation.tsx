"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bot, Loader2, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { storage } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

interface AiExplanationProps {
  question: string
  options?: string[]
  answer: string
}

export function AiExplanation({ question, options, answer }: AiExplanationProps) {
  const [explanation, setExplanation] = useState("")
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const { toast } = useToast()

  // Reset state when question changes and check cache
  useEffect(() => {
    setShow(false)
    setLoading(false)
    const cached = storage.getAiCache(question)
    if (cached) {
      setExplanation(cached)
    } else {
      setExplanation("")
    }
  }, [question, answer])

  const checkLimit = () => {
    const usage = storage.getAiUsage()
    if (usage.count >= 30) {
      toast({
        title: "今日额度已用完",
        description: "AI 解析每天限用 30 次，请明天再来。",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const fetchExplanation = async () => {
    if (!checkLimit()) return

    setLoading(true)
    try {
      const prompt = `请解析这道医学题目：
题目：${question}
${options && options.length > 0 ? `选项：\n${options.join('\n')}` : ''}
答案：${answer}

请提供详细的解析，解释为什么该选项是正确的，以及其他选项为什么是错误的。`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { 
              role: "system", 
              content: "你是一位专业的医学考试辅导助手，请简洁清晰地解析题目。注意：不要使用 markdown 的加粗（如 **）或列表符号（如 *），直接使用纯文本和数字列表。" 
            },
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await res.json();
      if (data.choices && data.choices.length > 0) {
        const content = data.choices[0].message.content
        setExplanation(content);
        storage.setAiCache(question, content)
        storage.incrementAiUsage()
      } else {
        setExplanation("抱歉，暂时无法获取解析。");
        toast({
            title: "获取失败",
            description: "暂时无法获取解析，请稍后重试。",
            variant: "destructive",
        })
      }
    } catch (error) {
      setExplanation("获取解析失败，请稍后重试。");
      toast({
        title: "网络错误",
        description: "请求失败，请检查网络后重试。",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExplain = async () => {
    if (show && explanation) {
        setShow(false);
        return;
    }
    
    setShow(true);
    
    if (explanation) {
        // Already have explanation (from cache or previous fetch), just show it
        return;
    }

    await fetchExplanation()
  }

  const handleRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await fetchExplanation()
  }

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <Button 
            variant="outline" 
            onClick={handleExplain} 
            className="flex-1 gap-2 border-primary/20 text-primary hover:bg-primary/5 transition-all"
            disabled={loading}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
            {loading ? "AI 思考中..." : (show ? "收起 AI 解析" : "AI 智能解析")}
        </Button>
        {show && explanation && !loading && (
            <Button
                variant="outline"
                size="icon"
                onClick={handleRegenerate}
                className="border-primary/20 text-primary hover:bg-primary/5"
                title="重新生成"
            >
                <RefreshCw className="w-4 h-4" />
            </Button>
        )}
      </div>
      
      {show && explanation && (
        <Card className="mt-3 border-primary/10 bg-primary/5 animate-in fade-in-0 zoom-in-95 duration-300">
          <CardContent className="pt-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
            <div className="flex gap-3 items-start">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-primary mb-2">深度解析</div>
                    <div className="prose dark:prose-invert max-w-none text-sm">
                        {explanation}
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}