"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { storage } from "@/lib/storage"
import { generateQuestionHash, cn, parseMatchingOptions } from "@/lib/utils"
import { MessageSquare, Send, User, Reply as ReplyIcon, X, ChevronDown, ChevronUp, Trash2, Bot } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { toast } from "sonner"
import type { SingleChoiceQuestion, MultipleChoiceQuestion, TrueFalseQuestion, MatchingQuestion } from "@/lib/question-data"

interface Comment {
  id: number
  content: string
  created_at: string
  parent_id: number
  nickname: string
  device_id: string
  is_ai: boolean
}

interface QuestionCommentsProps {
  questionText: string
  questionData?: SingleChoiceQuestion | MultipleChoiceQuestion | TrueFalseQuestion | MatchingQuestion
  questionType?: "single" | "multiple" | "trueFalse" | "matching"
  autoLoad?: boolean
}

export const QuestionComments: React.FC<QuestionCommentsProps> = ({
  questionText,
  questionData,
  questionType,
  autoLoad = true
}) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [questionHash, setQuestionHash] = useState<string | null>(null)
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [aiThinkingComments, setAiThinkingComments] = useState<Set<number>>(new Set())

  // Fetch comments only when expanded
  const loadComments = useCallback(async (forceRefresh = false) => {
    if (fetching && !forceRefresh) return
    if (!questionText || questionText.trim() === '') return // 确保questionText有效

    setFetching(true)
    try {
      const hash = await generateQuestionHash(questionText)
      console.log('Question text:', questionText)
      console.log('Generated hash:', hash)
      setQuestionHash(hash)
      const res = await fetch(`/api/comments?questionHash=${hash}&t=${Date.now()}`)
      const data = await res.json()
      console.log('API response:', data)
      if (Array.isArray(data)) {
        console.log('Setting comments:', data.length, 'items')
        setComments(data)
      } else {
        console.error('API did not return array:', data)
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    } finally {
      setFetching(false)
    }
  }, [questionText, fetching])

  useEffect(() => {
    if (isExpanded && questionText && questionText.trim() !== '') {
      loadComments()
    }
  }, [isExpanded, questionText]) // Only reload if text changes AND it's expanded

  // Reset expansion when question changes (optional, keeps UI clean)
  useEffect(() => {
    if (!autoLoad) {
      setIsExpanded(false)
      setComments([])
    } else {
      // When autoLoad is true, keep expanded but reload comments for new question
      setComments([])
      // 确保在新题目加载时重新获取评论
      if (questionText && questionText.trim() !== '') {
        loadComments(true)
      }
    }
  }, [questionText, autoLoad])

  const handleSubmit = async (parentId: number = 0) => {
    const content = newComment.trim()
    if (!content || !questionHash) return

    setLoading(true)
    const userInfo = storage.getUserInfo()

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionHash,
          deviceId: userInfo.deviceId,
          nickname: userInfo.nickname,
          content,
          parentId,
        }),
      })

      if (res.ok) {
        const result = await res.json()
        const newCommentId = result.commentId

        setNewComment("")
        setReplyTo(null)
        toast.success(parentId > 0 ? "回复成功" : "留言成功")

        // 确保用户评论能够显示
        setTimeout(() => {
          loadComments(true)
        }, 100)

        // 如果是顶级评论（非回复），异步触发AI自动回复，不阻塞用户体验
        if (parentId === 0 && newCommentId) {
          // 标记有AI正在思考
          setAiThinkingComments(prev => new Set(prev).add(newCommentId))

          const fullQuestionContext = buildFullQuestionContext()
          generateAiReply(questionHash, content, fullQuestionContext, newCommentId).then(() => {
            // AI回复成功后，延迟刷新以确保数据已保存
            setTimeout(() => {
              loadComments(true)
              setAiThinkingComments(new Set())
            }, 500)
          }).catch(aiError => {
            console.error("AI reply failed:", aiError)
            // AI回复失败时，清除思考状态
            setAiThinkingComments(new Set())
          })
        }
      } else {
        toast.error("操作失败")
      }
    } catch (error) {
      console.error("Failed to post comment:", error)
      toast.error("网络错误")
    } finally {
      setLoading(false)
    }
  }

  // 构建完整的题目信息上下文
  const buildFullQuestionContext = useCallback(() => {
    if (!questionData || !questionType) return questionText

    let context = `题目：${questionText}\n\n`

    // 根据题目类型添加选项和答案
    if (questionType === "single" || questionType === "multiple") {
      const q = questionData as SingleChoiceQuestion | MultipleChoiceQuestion
      context += "选项：\n"
      const options = questionType === "single"
        ? ["A", "B", "C", "D", "E"]
        : ["A", "B", "C", "D", "E", "F"]

      options.forEach(opt => {
        if ((q as any)[opt]) {
          const optionText = typeof (q as any)[opt] === "string"
            ? (q as any)[opt]
            : (q as any)[opt].text || (q as any)[opt]
          context += `${opt}. ${optionText}\n`
        }
      })

      context += `\n正确答案：${q.答案}\n`
    } else if (questionType === "trueFalse") {
      const q = questionData as TrueFalseQuestion
      context += "选项：\nA. 正确\nB. 错误\n"
      context += `\n正确答案：${q.答案 === "A" ? "正确" : "错误"}\n`
    } else if (questionType === "matching") {
      const q = questionData as MatchingQuestion
      // 解析匹配题选项
      const parsedOptions = parseMatchingOptions(q.选项)
      context += "匹配选项：\n"
      Object.entries(parsedOptions).forEach(([key, value]) => {
        context += `${key}. ${value}\n`
      })

      context += `\n正确答案：${q.答案}\n`
    }

    return context
  }, [questionText, questionData, questionType])

  const generateAiReply = async (questionHash: string, userComment: string, fullQuestionContext: string, parentCommentId: number) => {
    try {
      const res = await fetch("/api/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionHash,
          userComment,
          questionText: fullQuestionContext,
          parentId: parentCommentId,
        }),
      })

      if (!res.ok) {
        throw new Error("AI reply request failed")
      }

      // AI回复会在后台生成，不需要在这里处理响应
    } catch (error) {
      console.error("Failed to generate AI reply:", error)
      throw error
    }
  }

  const handleDelete = async (commentId: number) => {
    if (!confirm("确定要删除这条留言吗？")) return

    const userInfo = storage.getUserInfo()
    try {
      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: commentId,
          deviceId: userInfo.deviceId,
        }),
      })

      if (res.ok) {
        toast.success("删除成功")
        loadComments(true) // Force refresh comments
      } else {
        toast.error("删除失败")
      }
    } catch (error) {
      console.error("Failed to delete comment:", error)
      toast.error("网络错误")
    }
  }

  const threads = useMemo(() => {
    console.log('Comments data:', comments)
    console.log('Comments parent_id types:', comments.map(c => typeof c.parent_id + ': ' + c.parent_id))

    const rootComments = comments.filter(c => c.parent_id === 0 || c.parent_id === '0' as any)
    const replies = comments.filter(c => c.parent_id !== 0 && c.parent_id !== '0' as any)

    console.log('Root comments:', rootComments.length, 'Replies:', replies.length)

    const result = rootComments.map(root => ({
      ...root,
      replies: replies.filter(r => r.parent_id === root.id || r.parent_id === String(root.id) as any)
    }))

    console.log('Threads result:', result.length)
    return result
  }, [comments])

  const currentUserDeviceId = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return storage.getUserInfo().deviceId
  }, [])

  if (!isExpanded) {
    return (
      <div className="mt-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full border border-dashed border-primary/20 text-muted-foreground hover:text-primary hover:bg-primary/5"
          onClick={() => setIsExpanded(true)}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          查看讨论区
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-6 border-t pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3>讨论区 ({comments.length})</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
          <ChevronUp className="w-4 h-4 mr-1" />
          收起
        </Button>
      </div>

      <div className="space-y-3">
        {replyTo && (
          <div className="flex items-center justify-between bg-secondary/30 p-2 rounded-t-lg border-b border-primary/20 text-xs">
            <span className="text-muted-foreground">
              回复 <span className="font-semibold text-primary">@{replyTo.nickname || "匿名用户"}</span>:
            </span>
            <button onClick={() => setReplyTo(null)} className="hover:text-primary">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <Textarea
          placeholder={replyTo ? `回复 @${replyTo.nickname || "匿名用户"}...` : "分享你的见解或疑问..."}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className={cn(
            "min-h-[100px] resize-none focus-visible:ring-primary",
            replyTo && "rounded-t-none"
          )}
        />
        <div className="flex justify-end gap-2">
          {replyTo && (
            <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>
              取消回复
            </Button>
          )}
          <Button 
            onClick={() => handleSubmit(replyTo?.id || 0)} 
            disabled={loading || !newComment.trim()}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {replyTo ? "发布回复" : "发布留言"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {fetching && comments.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">加载中...</div>
        ) : threads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-secondary/10 rounded-lg">
            暂无留言，快来抢沙发吧！
          </div>
        ) : (
          threads.map((thread) => (
            <div key={thread.id} className="space-y-4">
              <div className={cn(
                "flex gap-3 p-3 rounded-lg transition-colors",
                thread.is_ai
                  ? "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
                  : "bg-secondary/5 hover:bg-secondary/10"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  thread.is_ai
                    ? "bg-blue-500"
                    : "bg-primary/10"
                )}>
                  {thread.is_ai ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary">{thread.nickname || "匿名用户"}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true, locale: zhCN })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{thread.content}</p>
                  <div className="flex items-center gap-4 pt-1">
                    <button 
                      onClick={() => {
                        setReplyTo(thread)
                        const el = document.querySelector('textarea')
                        if (el) el.focus()
                      }}
                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ReplyIcon className="w-3 h-3" />
                      回复
                    </button>
                    {currentUserDeviceId === thread.device_id && (
                      <button 
                        onClick={() => handleDelete(thread.id)}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        删除
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {thread.replies.length > 0 && (
                <div className="ml-11 space-y-3 border-l-2 border-secondary pl-4">
                  {thread.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-2 py-2 group">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                        reply.is_ai ? "bg-blue-500" : "bg-secondary/50"
                      )}>
                        {reply.is_ai ? (
                          <Bot className="w-3 h-3 text-white" />
                        ) : (
                          <User className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-primary/80">{reply.nickname || "匿名用户"}</span>
                            {currentUserDeviceId === reply.device_id && (
                              <button 
                                onClick={() => handleDelete(reply.id)}
                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <span className="text-[9px] text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: zhCN })}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-foreground/80">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* AI正在思考的显示 */}
        {aiThinkingComments.size > 0 && (
          <div className="flex gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/30 border border-blue-200 dark:border-blue-800 transition-colors animate-in fade-in slide-in-from-bottom-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary">DeepSeek</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  AI助手
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-blue-700 dark:text-blue-300">正在思考中...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
