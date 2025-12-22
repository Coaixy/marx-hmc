export interface SingleChoiceQuestion {
  章节: string
  题干: string
  A: string
  B: string
  C: string
  D: string
  E?: string
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
  E?: string
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

import questionsData from './marix.json'
import bioData from './bio.json'
import medBioData from './med_bio.json'

// 处理 med_bio 数据，将其转换为标准格式
const processMedBioData = (data: any[]): QuestionBank => {
  const result: QuestionBank = {
    判断题: [],
    单选题: [],
    多选题: []
  }

  data.forEach((item) => {
    // 如果有选项 A，则视为选择题
    if (item.A) {
      // 如果答案长度大于1，视为多选题
      // 移除答案中的空白字符以准确判断
      const cleanAnswer = item.答案 ? item.答案.replace(/\s/g, '') : ''
      if (cleanAnswer.length > 1) {
        result.多选题.push(item as MultipleChoiceQuestion)
      } else {
        result.单选题.push(item as SingleChoiceQuestion)
      }
    } else {
      // 没有选项视为判断题
      result.判断题.push(item as TrueFalseQuestion)
    }
  })

  return result
}

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
  },
  med_bio: {
    id: 'med_bio',
    name: '临床生物化学',
    data: processMedBioData(medBioData as any[])
  }
} as const

export type SubjectId = keyof typeof SUBJECTS
export const DEFAULT_SUBJECT: SubjectId = 'marx'

export const getQuestionBank = (subjectId: string): QuestionBank => {
  return SUBJECTS[subjectId as SubjectId]?.data || SUBJECTS.marx.data
}

