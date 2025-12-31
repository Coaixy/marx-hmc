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
