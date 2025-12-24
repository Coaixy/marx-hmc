"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { storage } from "@/lib/storage"

interface Snowflake {
  x: number
  y: number
  radius: number
  speed: number
  opacity: number
  drift: number
  swing: number // 左右摆动的频率
  swingOffset: number // 摆动的初始偏移
}

export function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const [showSnow, setShowSnow] = useState(true)

  useEffect(() => {
    // Initial load
    setShowSnow(storage.getSettings().showSnow)

    const handleSettingsUpdate = () => {
      setShowSnow(storage.getSettings().showSnow)
    }

    window.addEventListener('settings-updated', handleSettingsUpdate)
    return () => window.removeEventListener('settings-updated', handleSettingsUpdate)
  }, [])

  useEffect(() => {
    if (!showSnow) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    const isDark = resolvedTheme === "dark"
    const snowColor = isDark ? "255, 255, 255" : "100, 149, 237" // 深色模式纯白，浅色模式使用更明显的玉米粉蓝 (CornflowerBlue)

    let animationFrameId: number
    let snowflakes: Snowflake[] = []
    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      // 重新生成雪花或者保持现有数量适应新尺寸
      initSnowflakes()
    }

    const initSnowflakes = () => {
      const count = Math.floor((width * height) / 6000)
      snowflakes = []
      for (let i = 0; i < count; i++) {
        snowflakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 4 + 1.5,
          speed: Math.random() * 1.5 + 0.8,
          opacity: Math.random() * 0.4 + 0.5,
          drift: Math.random() * 0.4 - 0.2,
          swing: Math.random() * 0.02 + 0.01,
          swingOffset: Math.random() * Math.PI * 2,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      snowflakes.forEach((flake) => {
        ctx.save()
        // 计算摆动后的 X 坐标
        const xPos = flake.x + Math.sin(flake.swingOffset) * 15
        ctx.translate(xPos, flake.y)
        
        // 随机旋转，增加动感
        ctx.rotate(flake.swingOffset * 0.2)

        // 绘制具有“软边”的雪花
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, flake.radius)
        gradient.addColorStop(0, `rgba(${snowColor}, ${flake.opacity})`)
        gradient.addColorStop(0.5, `rgba(${snowColor}, ${flake.opacity * 0.6})`)
        gradient.addColorStop(1, `rgba(${snowColor}, 0)`)
        
        ctx.fillStyle = gradient
        ctx.arc(0, 0, flake.radius, 0, Math.PI * 2)
        ctx.fill()
        
        // 为一部分雪花添加六角星形状（更像真实的雪花结晶）
        if (flake.radius > 3) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${snowColor}, ${flake.opacity * 0.5})`
          ctx.lineWidth = 1
          for (let i = 0; i < 6; i++) {
            ctx.moveTo(0, 0)
            ctx.lineTo(0, -flake.radius * 1.2)
            ctx.rotate(Math.PI / 3)
          }
          ctx.stroke()
        }
        
        ctx.restore()
      })
    }

    const update = () => {
      snowflakes.forEach((flake) => {
        flake.y += flake.speed
        flake.swingOffset += flake.swing

        // 边界检查，循环利用
        if (flake.y > height) {
          flake.y = -flake.radius * 2
          flake.x = Math.random() * width
        }
      })
    }

    const loop = () => {
      draw()
      update()
      animationFrameId = requestAnimationFrame(loop)
    }

    window.addEventListener("resize", resize)
    resize()
    loop()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [resolvedTheme, showSnow]) // Re-run when theme or showSnow changes

  if (!showSnow) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ pointerEvents: "none" }} // 再次确保不阻挡点击
    />
  )
}

