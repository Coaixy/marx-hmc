"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  color: string
  size: number
}

export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particles: Particle[] = []
    let animationFrameId: number
    let lastFireworkTime = 0
    
    // 调整尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    const colors = [
      "#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93",
      "#f15bb5", "#00bbf9", "#00f5d4", "#fee440"
    ]

    const createFirework = (x: number, y: number) => {
      const particleCount = 40 + Math.random() * 30 // 不太密集
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const velocity = 2 + Math.random() * 3 // 速度适中
        
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          alpha: 1,
          color,
          size: 1.5 + Math.random() * 2
        })
      }
    }

    const loop = (timestamp: number) => {
      // 降低清除背景的不透明度以产生拖尾效果，或者完全清除以保持清爽
      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)" // 拖尾
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.globalCompositeOperation = "lighter" // 混合模式让光效更自然

      // 自动发射烟花，频率低一点
      if (timestamp - lastFireworkTime > 1200 + Math.random() * 1000) {
        // 随机位置，主要在上方
        const x = Math.random() * canvas.width
        const y = canvas.height * 0.2 + Math.random() * (canvas.height * 0.4)
        createFirework(x, y)
        lastFireworkTime = timestamp
      }

      // 更新粒子
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.04 // 重力
        p.vx *= 0.96 // 空气阻力
        p.vy *= 0.96
        p.alpha -= 0.015 // 消失速度

        if (p.alpha <= 0) {
          particles.splice(i, 1)
        } else {
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
      style={{ top: 0, left: 0 }}
    />
  )
}

