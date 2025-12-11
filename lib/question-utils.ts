import { type SingleChoiceQuestion, type MultipleChoiceQuestion, DEFAULT_QUESTION_BANK } from "./question-data"

// 联合类型，兼容现有的使用方式
export type Question = SingleChoiceQuestion | MultipleChoiceQuestion

export const getSequentialQuestion = (type: "single" | "multiple" | "trueFalse", index: number): Question | null => {
  if (type === "trueFalse") {
    const question = DEFAULT_QUESTION_BANK.判断题[index]
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
  const questions = type === "single" ? DEFAULT_QUESTION_BANK.单选题 : DEFAULT_QUESTION_BANK.多选题
  return questions[index] || null
}

export const getRandomQuestion = (type: "single" | "multiple" | "trueFalse"): { question: Question; index: number } | null => {
  if (type === "trueFalse") {
    const questions = DEFAULT_QUESTION_BANK.判断题
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
  const questions = type === "single" ? DEFAULT_QUESTION_BANK.单选题 : DEFAULT_QUESTION_BANK.多选题
  if (questions.length === 0) return null
  const index = Math.floor(Math.random() * questions.length)
  return { question: questions[index], index }
}

export const getExamQuestions = () => {
  const singleQuestions = DEFAULT_QUESTION_BANK.单选题.sort(() => Math.random() - 0.5).slice(0, 25)
  const multipleQuestions = DEFAULT_QUESTION_BANK.多选题.sort(() => Math.random() - 0.5).slice(0, 5)
  const trueFalseQuestions = DEFAULT_QUESTION_BANK.判断题
    .map((q) => ({
      ...q,
      答案: q.答案 === "√" ? "A" : "B",
      A: "√",
      B: "×",
    }))
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
  return { singleQuestions, multipleQuestions, trueFalseQuestions }
}

export const getTotalQuestions = () => {
  return {
    single: DEFAULT_QUESTION_BANK.单选题.length,
    multiple: DEFAULT_QUESTION_BANK.多选题.length,
    trueFalse: DEFAULT_QUESTION_BANK.判断题.length,
  }
}
