import { type SingleChoiceQuestion, type MultipleChoiceQuestion, type MatchingQuestion, type Question, getQuestionBank } from "./question-data"

export { type Question }

export const getSequentialQuestion = (subjectId: string, type: "single" | "multiple" | "trueFalse" | "matching", index: number): Question | null => {
  const bank = getQuestionBank(subjectId)


  if (type === "trueFalse") {
    const questions = bank.判断题 || []
    const question = questions[index]
    return question ? {
      题干: question.题干,
      答案: question.答案 === "√" ? "A" : "B",
      // 为判断题添加空的选项以兼容QuestionCard组件
      A: "√",
      B: "×",
      C: "",
      D: "",
      章节: "",
      难度: ""
    } : null
  }

  if (type === "matching") {
    const questions = bank.匹配题 || []
    return questions[index] || null
  }

  const questions = type === "single" ? (bank.单选题 || []) : (bank.多选题 || [])
  return questions[index] || null
}

export const getRandomQuestion = (subjectId: string, type: "single" | "multiple" | "trueFalse" | "matching"): { question: Question; index: number } | null => {
  const isValidQuestion = (q: any, type: "single" | "multiple" | "trueFalse" | "matching") => {
    if (!q.题干 || !q.答案) return false
    if (type === "single" || type === "multiple") {
      // Must have at least option A
      return !!(q.A && String(q.A).trim())
    }
    return true
  }

  const bank = getQuestionBank(subjectId)

  if (type === "trueFalse") {
    const questions = bank.判断题 || []
    if (questions.length === 0) return null

    // Filter valid questions with original index
    const validQuestions = questions.map((q, i) => ({ q, i }))
      .filter(item => isValidQuestion(item.q, "trueFalse"))

    if (validQuestions.length === 0) return null
    const { q: question, i: index } = validQuestions[Math.floor(Math.random() * validQuestions.length)]

    return {
      question: {
        题干: question.题干,
        答案: question.答案 === "√" ? "A" : "B",
        A: "√",
        B: "×",
        C: "",
        D: "",
        章节: "",
        难度: ""
      },
      index
    }
  }

  if (type === "matching") {
    const questions = bank.匹配题 || []
    if (questions.length === 0) return null

    const validQuestions = questions.map((q, i) => ({ q, i }))
      .filter(item => isValidQuestion(item.q, "matching"))

    if (validQuestions.length === 0) return null
    const { q: question, i: index } = validQuestions[Math.floor(Math.random() * validQuestions.length)]

    return { question, index }
  }

  const rawQuestions = type === "single" ? (bank.单选题 || []) : (bank.多选题 || [])
  if (rawQuestions.length === 0) return null

  const validQuestions = rawQuestions.map((q, i) => ({ q, i }))
    .filter(item => isValidQuestion(item.q, type))

  if (validQuestions.length === 0) return null
  const { q: question, i: index } = validQuestions[Math.floor(Math.random() * validQuestions.length)]

  return { question, index }
}

export interface ExamQuestionWithIndex {
  question: any
  originalIndex: number // Original index in the question bank
}

export const getExamQuestions = (subjectId: string) => {
  const bank = getQuestionBank(subjectId)

  // Fisher-Yates shuffle algorithm for stronger randomness
  const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Helper function to get random questions with original indices
  const getRandomQuestionsWithIndices = (questions: any[], count: number, type: "single" | "multiple" | "trueFalse" | "matching") => {
    const isValidQuestion = (q: any) => {
      if (!q.题干 || !q.答案) return false
      if (type === "single" || type === "multiple") {
        return !!(q.A && String(q.A).trim())
      }
      return true
    }

    const indexed = questions.map((q, idx) => ({ question: q, originalIndex: idx }))
      .filter(item => isValidQuestion(item.question))

    return shuffleArray(indexed).slice(0, count)
  }

  // Get valid pools first to determine counts
  const singlePool = getRandomQuestionsWithIndices(bank.单选题 || [], Infinity, "single")
  const multiplePool = getRandomQuestionsWithIndices(bank.多选题 || [], Infinity, "multiple")
  const tfPool = getRandomQuestionsWithIndices(bank.判断题 || [], Infinity, "trueFalse")
  const matchingPool = getRandomQuestionsWithIndices(bank.匹配题 || [], Infinity, "matching")

  const singleTotal = singlePool.length
  const multipleTotal = multiplePool.length
  const tfTotal = tfPool.length
  const matchingTotal = matchingPool.length

  // Config based on question bank size
  // Strategy: consistent with "based on question bank ... not fixed template"
  // We use a significant portion of the bank but capped at reasonable limits for an exam
  const singleCount = Math.min(singleTotal, 50)
  const multipleCount = Math.min(multipleTotal, 20)
  const tfCount = Math.min(tfTotal, 20)
  const matchingCount = Math.min(matchingTotal, 10)

  // Recalculate random selection with limits (Since pools are already shuffled, we can just slice them, 
  // but getRandomQuestionsWithIndices shuffled them.
  // Wait, I called it with Infinity earlier. It returns shuffled array.
  // So I can just slice the pools.

  const singleQuestions = singlePool.slice(0, singleCount)
  const multipleQuestions = multiplePool.slice(0, multipleCount)

  const trueFalseQuestions = tfPool.slice(0, tfCount).map(({ question, originalIndex }) => ({
    question: {
      ...question,
      答案: question.答案 === "√" ? "A" : "B",
      A: "√",
      B: "×",
      C: "",
      D: "",
      章节: "",
      难度: ""
    },
    originalIndex
  }))

  const matchingQuestions = matchingPool.slice(0, matchingCount)

  return { singleQuestions, multipleQuestions, trueFalseQuestions, matchingQuestions }
}

export const getTotalQuestions = (subjectId: string) => {
  const bank = getQuestionBank(subjectId)

  const countValid = (questions: any[], type: "single" | "multiple" | "trueFalse" | "matching") => {
    return (questions || []).filter(q => {
      if (!q.题干 || !q.答案) return false
      if (type === "single" || type === "multiple") return !!(q.A && String(q.A).trim())
      return true
    }).length
  }

  return {
    single: countValid(bank.单选题 || [], "single"),
    multiple: countValid(bank.多选题 || [], "multiple"),
    trueFalse: countValid(bank.判断题 || [], "trueFalse"),
    matching: countValid(bank.匹配题 || [], "matching"),
  }
}
