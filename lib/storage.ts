export interface AnswerRecord {
  id: string
  questionIndex: number
  type: "single" | "multiple" | "trueFalse"
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
  lastUpdated: number
}

const getStorageKey = (baseKey: string, subjectId: string) => `${baseKey}_${subjectId}`

const STORAGE_KEYS = {
  WRONG_ANSWERS: "wrong_answers",
  STUDY_PROGRESS: "study_progress",
  EXAM_RESULTS: "exam_results",
  EXAM_RECORDS: "exam_records"
}

export const storage = {
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
    if (typeof window === "undefined") return { singleIndex: 0, multipleIndex: 0, trueFalseIndex: 0, lastUpdated: 0 }
    const key = getStorageKey(STORAGE_KEYS.STUDY_PROGRESS, subjectId)
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : { singleIndex: 0, multipleIndex: 0, trueFalseIndex: 0, lastUpdated: Date.now() }
  },

  setProgress: (subjectId: string, progress: StudyProgress) => {
    if (typeof window === "undefined") return
    const key = getStorageKey(STORAGE_KEYS.STUDY_PROGRESS, subjectId)
    localStorage.setItem(key, JSON.stringify(progress))
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
