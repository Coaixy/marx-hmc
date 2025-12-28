import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const NEGATIVE_KEYWORDS = ["错误", "不正确", "不包括", "不属于", "不对", "说法错误"]

export const highlightNegativeKeywords = (text: string) => {
  if (!text) return ""
  const regex = new RegExp(`(${NEGATIVE_KEYWORDS.join("|")})`, "g")
  return text.split(regex)
}
