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

export const getExamQuestions = (subjectId: string) => {
  const bank = getQuestionBank(subjectId)

  const singleQuestions = (bank.单选题 || []).sort(() => Math.random() - 0.5).slice(0, 25)
  const multipleQuestions = (bank.多选题 || []).sort(() => Math.random() - 0.5).slice(0, 5)
  const trueFalseQuestions = (bank.判断题 || [])
    .map((q) => ({
      ...q,
      答案: q.答案 === "√" ? "A" : "B",
      A: "√",
      B: "×",
      C: "",
      D: "",
      章节: "",
      难度: ""
    }))
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)

  // Include matching questions if available (up to 5 questions)
  const matchingQuestions = (bank.匹配题 || [])
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)

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
