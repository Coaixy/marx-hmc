"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { storage } from "@/lib/storage"
import { MessageSquare, Send, User, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface Comment {
  id: number
  content: string
  created_at: string
  parent_id: number
  nickname: string
  device_id: string
  is_ai: boolean
}

// 固定的反馈板 Hash
const FEEDBACK_BOARD_HASH = "site-feedback-board-v1"

export function FeedbackBoard() {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [deviceUUID, setDeviceUUID] = useState<string>("")

  useEffect(() => {
    // 获取当前设备ID，用于判断是否可以删除自己的评论
    const userInfo = storage.getUserInfo()
    setDeviceUUID(userInfo.deviceId)
    loadComments()
  }, [])

  const loadComments = useCallback(async () => {
    if (fetching) return
    setFetching(true)
    try {
      const res = await fetch(`/api/comments?questionHash=${FEEDBACK_BOARD_HASH}&t=${Date.now()}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setComments(data)
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
      toast.error("无法加载留言，请稍后再试")
    } finally {
      setFetching(false)
    }
  }, [fetching])

  const handleSubmit = async () => {
    const content = newComment.trim()
    if (!content) return

    setLoading(true)
    const userInfo = storage.getUserInfo()

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionHash: FEEDBACK_BOARD_HASH,
          deviceId: userInfo.deviceId,
          nickname: userInfo.nickname,
          content,
          parentId: 0, // 反馈板暂时只支持一级评论
        }),
      })

      if (res.ok) {
        setNewComment("")
        loadComments()
        toast.success("留言发布成功")
      } else {
        toast.error("发布失败，请稍后再试")
      }
    } catch (error) {
      console.error("Failed to post comment:", error)
      toast.error("发布出错")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (commentId: number) => {
    if (!confirm("确定要删除这条留言吗？")) return

    try {
      const userInfo = storage.getUserInfo()
      const res = await fetch(`/api/comments?id=${commentId}&deviceId=${userInfo.deviceId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId))
        toast.success("留言已删除")
      } else {
        toast.error("删除失败")
      }
    } catch (error) {
      console.error("Failed to delete comment:", error)
      toast.error("删除出错")
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 font-mono">
      {/* Input Area - Neo-Brutalist Style */}
      <div className="border border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
        <div className="absolute -top-3 left-4 bg-black text-white px-2 py-0.5 text-xs font-bold uppercase tracking-widest">
          New_Message
        </div>
        <div className="space-y-4 pt-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的想法、建议或反馈..."
            className="min-h-[100px] resize-none border-black focus:ring-0 focus:border-black rounded-none bg-gray-50 placeholder:text-gray-400"
          />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-xs text-gray-500 leading-relaxed">
              * 请文明发言，共同维护良好的社区环境
            </p>
            <Button
              onClick={handleSubmit}
              disabled={loading || !newComment.trim()}
              className="w-full sm:w-auto rounded-none border border-black bg-black text-white hover:bg-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-none transition-all"
            >
              {loading ? (
                <span className="animate-pulse">SENDING...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  POST MESSAGE
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-black animate-pulse" />
          <h2 className="text-xl font-bold uppercase tracking-tighter">
            System_Logs ({comments.length})
          </h2>
        </div>

        <AnimatePresence mode="popLayout">
          {comments.length === 0 && !fetching ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 border border-dashed border-black opacity-50"
            >
              <MessageSquare className="w-8 h-8 mx-auto mb-2" />
              <p>NO DATA FOUND</p>
            </motion.div>
          ) : (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative border border-black bg-white p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 border border-black flex items-center justify-center bg-gray-50">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm flex items-center gap-2">
                        {comment.nickname}
                        {comment.device_id === deviceUUID && (
                          <span className="bg-black text-white text-[10px] px-1 py-0.5 rounded-none">YOU</span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: zhCN })}
                      </div>
                    </div>
                  </div>

                  {comment.device_id === deviceUUID && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(comment.id)}
                      className="h-6 w-6 rounded-none hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                <div className="text-sm leading-relaxed whitespace-pre-wrap mt-3 sm:mt-0 sm:pl-10 sm:border-l sm:border-gray-200">
                  {comment.content}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
