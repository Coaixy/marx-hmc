"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { storage } from "@/lib/storage"
import { generateQuestionHash, cn } from "@/lib/utils"
import { MessageSquare, Send, User, Reply as ReplyIcon, X, ChevronDown, ChevronUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { toast } from "sonner"

interface Comment {
  id: number
  content: string
  created_at: string
  parent_id: number
  nickname: string
  device_id: string
}

interface QuestionCommentsProps {
  questionText: string
  autoLoad?: boolean
}

export const QuestionComments: React.FC<QuestionCommentsProps> = ({ questionText, autoLoad = false }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [isExpanded, setIsExpanded] = useState(autoLoad)
  const [questionHash, setQuestionHash] = useState<string | null>(null)
  const [replyTo, setReplyTo] = useState<Comment | null>(null)

  // Fetch comments only when expanded
  const loadComments = useCallback(async () => {
    if (fetching) return
    
    setFetching(true)
    try {
      const hash = await generateQuestionHash(questionText)
      setQuestionHash(hash)
      const res = await fetch(`/api/comments?questionHash=${hash}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setComments(data)
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    } finally {
      setFetching(false)
    }
  }, [questionText, fetching])

  useEffect(() => {
    if (isExpanded) {
      loadComments()
    }
  }, [isExpanded, questionText]) // Only reload if text changes AND it's expanded

  // Reset expansion when question changes (optional, keeps UI clean)
  useEffect(() => {
    if (!autoLoad) {
      setIsExpanded(false)
      setComments([])
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
        setNewComment("")
        setReplyTo(null)
        toast.success(parentId > 0 ? "回复成功" : "留言成功")
        loadComments()
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

  const threads = useMemo(() => {
    const rootComments = comments.filter(c => c.parent_id === 0)
    const replies = comments.filter(c => c.parent_id !== 0)
    
    return rootComments.map(root => ({
      ...root,
      replies: replies.filter(r => r.parent_id === root.id)
    }))
  }, [comments])

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
              <div className="flex gap-3 p-3 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">{thread.nickname || "匿名用户"}</span>
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
                  </div>
                </div>
              </div>

              {thread.replies.length > 0 && (
                <div className="ml-11 space-y-3 border-l-2 border-secondary pl-4">
                  {thread.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-2 py-2">
                      <div className="w-6 h-6 rounded-full bg-secondary/50 flex items-center justify-center flex-shrink-0">
                        <User className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-primary/80">{reply.nickname || "匿名用户"}</span>
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
      </div>
    </div>
  )
}
