export interface SingleChoiceQuestion {
  章节: string
  题干: string
  A: string
  B: string
  C: string
  D: string
  答案: string
  难度: string
}

export interface MultipleChoiceQuestion {
  章节: string
  题干: string
  A: string
  B: string
  C: string
  D: string
  答案: string
  难度: string
}

export interface TrueFalseQuestion {
  题干: string
  答案: string
}

// 联合类型，兼容现有的使用方式
export type Question = SingleChoiceQuestion | MultipleChoiceQuestion

export interface QuestionBank {
  判断题: TrueFalseQuestion[]
  单选题: SingleChoiceQuestion[]
  多选题: MultipleChoiceQuestion[]
}

import questionsData from './question.json'
import bioData from './bio.json'

export const SUBJECTS = {
  marx: {
    id: 'marx',
    name: '马克思主义基本原理',
    data: questionsData as QuestionBank
  },
  bio: {
    id: 'bio',
    name: '生物化学',
    data: bioData as unknown as QuestionBank
  }
} as const

export type SubjectId = keyof typeof SUBJECTS
export const DEFAULT_SUBJECT: SubjectId = 'marx'

export const getQuestionBank = (subjectId: string): QuestionBank => {
  return SUBJECTS[subjectId as SubjectId]?.data || SUBJECTS.marx.data
}

