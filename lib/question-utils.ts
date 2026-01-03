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
  const bank = getQuestionBank(subjectId)

  if (type === "trueFalse") {
    const questions = bank.判断题 || []
    if (questions.length === 0) return null
    const index = Math.floor(Math.random() * questions.length)
    const question = questions[index]
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
    const index = Math.floor(Math.random() * questions.length)
    return { question: questions[index], index }
  }

  const questions = type === "single" ? (bank.单选题 || []) : (bank.多选题 || [])
  if (questions.length === 0) return null
  const index = Math.floor(Math.random() * questions.length)
  return { question: questions[index], index }
}

export interface ExamQuestionWithIndex {
  question: any
  originalIndex: number // Original index in the question bank
}

export const getExamQuestions = (subjectId: string) => {
  const bank = getQuestionBank(subjectId)

  // Helper function to get random questions with original indices
  const getRandomQuestionsWithIndices = (questions: any[], count: number) => {
    const indexed = questions.map((q, idx) => ({ question: q, originalIndex: idx }))
    return indexed.sort(() => Math.random() - 0.5).slice(0, count)
  }

  const singleQuestions = getRandomQuestionsWithIndices(bank.单选题 || [], 25)
  const multipleQuestions = getRandomQuestionsWithIndices(bank.多选题 || [], 5)
  const trueFalseQuestions = getRandomQuestionsWithIndices(bank.判断题 || [], 10).map(({ question, originalIndex }) => ({
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

  // Include matching questions if available (up to 5 questions)
  const availableMatching = bank.匹配题 || []
  const matchingQuestions = availableMatching.length > 0 ? getRandomQuestionsWithIndices(availableMatching, Math.min(5, availableMatching.length)) : []

  return { singleQuestions, multipleQuestions, trueFalseQuestions, matchingQuestions }
}

export const getTotalQuestions = (subjectId: string) => {
  const bank = getQuestionBank(subjectId)
  return {
    single: (bank.单选题 || []).length,
    multiple: (bank.多选题 || []).length,
    trueFalse: (bank.判断题 || []).length,
    matching: (bank.匹配题 || []).length,
  }
}
