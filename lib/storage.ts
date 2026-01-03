export interface AnswerRecord {
  id: string
  questionIndex: number // Index in the original question bank
  type: "single" | "multiple" | "trueFalse" | "matching"
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timestamp: number
  subjectId?: string // Add subjectId to record
}

export interface ExamRecord {
  id: string
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  timestamp: number
  subjectId?: string
}

export interface StudyProgress {
  singleIndex: number
  multipleIndex: number
  trueFalseIndex: number
  matchingIndex: number
  lastUpdated: number
}

export interface RandomProgress {
  count: number
  mode: "single" | "multiple" | "trueFalse" | "matching"
  currentQuestion: { question: any; index: number } | null
  submitted: boolean
  selectedAnswer?: string
  lastUpdated: number
  shuffledIndices?: number[]
  currentIndex?: number
}

const getStorageKey = (baseKey: string, subjectId: string) => `${baseKey}_${subjectId}`

const STORAGE_KEYS = {
  WRONG_ANSWERS: "wrong_answers",
  STUDY_PROGRESS: "study_progress",
  RANDOM_PROGRESS: "random_progress",
  EXAM_RESULTS: "exam_results",
  EXAM_RECORDS: "exam_records",
  AI_CACHE: "ai_cache",
  AI_USAGE: "ai_usage",
  SETTINGS: "app_settings",
  USER_INFO: "user_info"
}

export interface UserInfo {
  deviceId: string
  nickname: string
}

export interface AppSettings {
}

const DEFAULT_SETTINGS: AppSettings = {
}

export const storage = {
  // AI Usage Limit
  getAiUsage: (): { count: number; date: string } => {
    if (typeof window === "undefined") return { count: 0, date: new Date().toDateString() }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AI_USAGE)
      const today = new Date().toDateString()
      if (!data) return { count: 0, date: today }
      
      const usage = JSON.parse(data)
      if (usage.date !== today) {
        return { count: 0, date: today }
      }
      return usage
    } catch (e) {
      return { count: 0, date: new Date().toDateString() }
    }
  },

  incrementAiUsage: () => {
    if (typeof window === "undefined") return
    const today = new Date().toDateString()
    const usage = storage.getAiUsage()
    
    const newUsage = {
      count: usage.date === today ? usage.count + 1 : 1,
      date: today
    }
    localStorage.setItem(STORAGE_KEYS.AI_USAGE, JSON.stringify(newUsage))
    return newUsage.count
  },

  // AI Cache
  getAiCache: (question: string): string | null => {
    if (typeof window === "undefined") return null
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AI_CACHE)
      if (!data) return null
      const cache = JSON.parse(data)
      // Simple cache key: hash of the question or just the question string if short enough.
      // Given question length might vary, we can assume the question string itself is the key for now.
      // But localStorage has size limits. For a large app, we might need to be careful.
      // Let's use the question string as key for simplicity in this prototype.
      return cache[question] || null
    } catch (e) {
      return null
    }
  },

  setAiCache: (question: string, explanation: string) => {
    if (typeof window === "undefined") return
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AI_CACHE)
      const cache = data ? JSON.parse(data) : {}
      cache[question] = explanation
      localStorage.setItem(STORAGE_KEYS.AI_CACHE, JSON.stringify(cache))
    } catch (e) {
      // Ignore errors (e.g. quota exceeded)
    }
  },

  // Settings
  getSettings: (): AppSettings => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS
  },

  updateSettings: (settings: Partial<AppSettings>) => {
    if (typeof window === "undefined") return
    const current = storage.getSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated))
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('settings-updated'))
  },

  // User Info
  getUserInfo: (): UserInfo => {
    if (typeof window === "undefined") return { deviceId: '', nickname: '匿名用户' }
    const data = localStorage.getItem(STORAGE_KEYS.USER_INFO)
    if (data) return JSON.parse(data)
    
    // Generate new device ID if not exists
    const newInfo: UserInfo = {
      deviceId: crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15),
      nickname: '匿名用户'
    }
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(newInfo))
    return newInfo
  },

  updateUserInfo: (info: Partial<UserInfo>) => {
    if (typeof window === "undefined") return
    const current = storage.getUserInfo()
    const updated = { ...current, ...info }
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(updated))
  },

  // Wrong answers management
  getWrongAnswers: (subjectId: string): AnswerRecord[] => {
    if (typeof window === "undefined") return []
    const key = getStorageKey(STORAGE_KEYS.WRONG_ANSWERS, subjectId)
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  },

  addWrongAnswer: (subjectId: string, record: AnswerRecord) => {
    if (typeof window === "undefined") return
    const answers = storage.getWrongAnswers(subjectId)
    // Avoid duplicates if needed, or just push
    answers.push({ ...record, subjectId })
    const key = getStorageKey(STORAGE_KEYS.WRONG_ANSWERS, subjectId)
    localStorage.setItem(key, JSON.stringify(answers))
  },

  removeWrongAnswer: (subjectId: string, id: string) => {
    if (typeof window === "undefined") return
    const answers = storage.getWrongAnswers(subjectId)
    const filtered = answers.filter((a) => a.id !== id)
    const key = getStorageKey(STORAGE_KEYS.WRONG_ANSWERS, subjectId)
    localStorage.setItem(key, JSON.stringify(filtered))
  },

  clearWrongAnswers: (subjectId: string) => {
    if (typeof window === "undefined") return
    const key = getStorageKey(STORAGE_KEYS.WRONG_ANSWERS, subjectId)
    localStorage.removeItem(key)
  },

  // Study progress
  getProgress: (subjectId: string): StudyProgress => {
    if (typeof window === "undefined") return { singleIndex: 0, multipleIndex: 0, trueFalseIndex: 0, matchingIndex: 0, lastUpdated: 0 }
    const key = getStorageKey(STORAGE_KEYS.STUDY_PROGRESS, subjectId)
    const data = localStorage.getItem(key)
    const defaultProgress = { singleIndex: 0, multipleIndex: 0, trueFalseIndex: 0, matchingIndex: 0, lastUpdated: Date.now() }
    return data ? { ...defaultProgress, ...JSON.parse(data) } : defaultProgress
  },

  setProgress: (subjectId: string, progress: StudyProgress) => {
    if (typeof window === "undefined") return
    const key = getStorageKey(STORAGE_KEYS.STUDY_PROGRESS, subjectId)
    localStorage.setItem(key, JSON.stringify(progress))
  },

  // Random progress
  getRandomProgress: (subjectId: string): RandomProgress | null => {
    if (typeof window === "undefined") return null
    const key = getStorageKey(STORAGE_KEYS.RANDOM_PROGRESS, subjectId)
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  },

  setRandomProgress: (subjectId: string, progress: RandomProgress) => {
    if (typeof window === "undefined") return
    const key = getStorageKey(STORAGE_KEYS.RANDOM_PROGRESS, subjectId)
    localStorage.setItem(key, JSON.stringify(progress))
  },

  clearRandomProgress: (subjectId: string) => {
    if (typeof window === "undefined") return
    const key = getStorageKey(STORAGE_KEYS.RANDOM_PROGRESS, subjectId)
    localStorage.removeItem(key)
  },

  // Exam results (Current temporary exam result)
  getExamResults: (subjectId: string): AnswerRecord[] => {
    if (typeof window === "undefined") return []
    const key = getStorageKey(STORAGE_KEYS.EXAM_RESULTS, subjectId)
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  },

  saveExamResults: (subjectId: string, results: AnswerRecord[]) => {
    if (typeof window === "undefined") return
    const key = getStorageKey(STORAGE_KEYS.EXAM_RESULTS, subjectId)
    localStorage.setItem(key, JSON.stringify(results))
  },

  clearExamResults: (subjectId: string) => {
    if (typeof window === "undefined") return
    const key = getStorageKey(STORAGE_KEYS.EXAM_RESULTS, subjectId)
    localStorage.removeItem(key)
  },

  // Exam records management (Historical records)
  getExamRecords: (subjectId: string): ExamRecord[] => {
    if (typeof window === "undefined") return []
    const key = getStorageKey(STORAGE_KEYS.EXAM_RECORDS, subjectId)
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  },

  saveExamRecord: (subjectId: string, record: ExamRecord) => {
    if (typeof window === "undefined") return
    const records = storage.getExamRecords(subjectId)
    records.push({ ...record, subjectId })
    const key = getStorageKey(STORAGE_KEYS.EXAM_RECORDS, subjectId)
    localStorage.setItem(key, JSON.stringify(records))
  },

  clearExamRecords: (subjectId: string) => {
    if (typeof window === "undefined") return
    const key = getStorageKey(STORAGE_KEYS.EXAM_RECORDS, subjectId)
    localStorage.removeItem(key)
  },
}
