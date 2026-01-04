import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const NEGATIVE_KEYWORDS = ["错误", "不正确", "不包括", "不属于", "不对", "说法错误", "无关"]

export const highlightNegativeKeywords = (text: string) => {
  if (!text) return ""
  const regex = new RegExp(`(${NEGATIVE_KEYWORDS.join("|")})`, "g")
  return text.split(regex)
}

export const parseMatchingOptions = (optionsStr: string): Record<string, string> => {
  if (!optionsStr) return {}
  
  const options: Record<string, string> = {}
  
  // Match pattern: "A. Content" or "A、Content"
  // We use a regex that looks for a letter at the start or preceded by whitespace, 
  // followed by a dot/comma, and captures content until the next such pattern or end of string.
  
  // This regex matches:
  // Group 1: The Option Letter (A-Z)
  // Group 2: The content
  const regex = /([A-Z])[.、]\s*(.*?)(?=\s+[A-Z][.、]|$)/g
  
  // If the string doesn't look like it has standard separators, try to just split by spaces if they look like options
  // But for now let's rely on the structure seen in cell.json which is "A.xxx B.xxx"
  
  let match
  while ((match = regex.exec(optionsStr)) !== null) {
    if (match[1] && match[2]) {
      options[match[1]] = match[2].trim()
    }
  }
  
  // Fallback: simple split if regex fails to find anything but string is not empty
  if (Object.keys(options).length === 0 && optionsStr.trim().length > 0) {
      // Try splitting by space and see if parts start with A., B. etc
      const parts = optionsStr.trim().split(/\s+/)
      parts.forEach(part => {
          const m = part.match(/^([A-Z])[.、](.*)/)
          if (m) {
              options[m[1]] = m[2]
          }
      })
  }
  
  return options
}

const hashCache = new Map<string, string>();

export async function generateQuestionHash(text: string): Promise<string> {
  if (hashCache.has(text)) return hashCache.get(text)!;

  let hash = '';
  try {
    // 优先使用 Web Crypto API (需要 HTTPS)
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // 降级方案：简单的哈希算法 (确保在非 HTTPS 环境下也能运行)
      let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
      for (let i = 0, ch; i < text.length; i++) {
        ch = text.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      hash = (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
    }
  } catch (e) {
    console.error("Hash generation error:", e);
    // 最后的保底方案
    hash = text.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0).toString(16);
  }
  
  hashCache.set(text, hash);
  return hash;
}
