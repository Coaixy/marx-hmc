export interface AnswerRecord {
  id: string
  questionIndex: number
  type: "single" | "multiple" | "trueFalse"
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timestamp: number
}

export interface ExamRecord {
  id: string
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  timestamp: number
}

export interface StudyProgress {
  singleIndex: number
  multipleIndex: number
  trueFalseIndex: number
  lastUpdated: number
}

const STORAGE_KEYS = {
  WRONG_ANSWERS: "wrong_answers",
  STUDY_PROGRESS: "study_progress",
  EXAM_RESULTS: "exam_results",
}

export const storage = {
  // Wrong answers management
  getWrongAnswers: (): AnswerRecord[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.WRONG_ANSWERS)
    return data ? JSON.parse(data) : []
  },

  addWrongAnswer: (record: AnswerRecord) => {
    if (typeof window === "undefined") return
    const answers = storage.getWrongAnswers()
    answers.push(record)
    localStorage.setItem(STORAGE_KEYS.WRONG_ANSWERS, JSON.stringify(answers))
  },

  removeWrongAnswer: (id: string) => {
    if (typeof window === "undefined") return
    const answers = storage.getWrongAnswers()
    const filtered = answers.filter((a) => a.id !== id)
    localStorage.setItem(STORAGE_KEYS.WRONG_ANSWERS, JSON.stringify(filtered))
  },

  clearWrongAnswers: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEYS.WRONG_ANSWERS)
  },

  // Study progress
  getProgress: (): StudyProgress => {
    if (typeof window === "undefined") return { singleIndex: 0, multipleIndex: 0, trueFalseIndex: 0, lastUpdated: 0 }
    const data = localStorage.getItem(STORAGE_KEYS.STUDY_PROGRESS)
    return data ? JSON.parse(data) : { singleIndex: 0, multipleIndex: 0, trueFalseIndex: 0, lastUpdated: Date.now() }
  },

  setProgress: (progress: StudyProgress) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.STUDY_PROGRESS, JSON.stringify(progress))
  },

  // Exam results
  getExamResults: (): AnswerRecord[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS)
    return data ? JSON.parse(data) : []
  },

  saveExamResults: (results: AnswerRecord[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.EXAM_RESULTS, JSON.stringify(results))
  },

  clearExamResults: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEYS.EXAM_RESULTS)
  },

  // Exam records management
  getExamRecords: (): ExamRecord[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem("exam_records")
    return data ? JSON.parse(data) : []
  },

  saveExamRecord: (record: ExamRecord) => {
    if (typeof window === "undefined") return
    const records = storage.getExamRecords()
    records.push(record)
    localStorage.setItem("exam_records", JSON.stringify(records))
  },

  clearExamRecords: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem("exam_records")
  },
}
