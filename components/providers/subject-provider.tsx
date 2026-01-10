"use client"

import * as React from "react"
import { SUBJECTS, type SubjectId, DEFAULT_SUBJECT } from "@/lib/question-data"

interface SubjectContextType {
  subjectId: SubjectId
  setSubjectId: (id: SubjectId) => void
  subject: typeof SUBJECTS[SubjectId]
}

const SubjectContext = React.createContext<SubjectContextType | undefined>(undefined)

export function SubjectProvider({ children }: { children: React.ReactNode }) {
  const [subjectId, setSubjectIdState] = React.useState<SubjectId>(DEFAULT_SUBJECT)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    // Load from local storage on mount
    const savedSubject = localStorage.getItem("selected_subject") as SubjectId
    if (savedSubject && SUBJECTS[savedSubject]) {
      setSubjectIdState(savedSubject)
    }
    setIsLoaded(true)
  }, [])

  const setSubjectId = (id: SubjectId) => {
    setSubjectIdState(id)
    localStorage.setItem("selected_subject", id)
  }

  const value = {
    subjectId,
    setSubjectId,
    subject: SUBJECTS[subjectId],
  }

  // Prevent hydration mismatch or flash of wrong content by waiting for mount
  // But for this simple app, we can just render. 
  // If we want to be strict, we could render null until loaded, but default is fine.

  return (
    <SubjectContext.Provider value={value}>
      {children}
    </SubjectContext.Provider>
  )
}

export function useSubject() {
  const context = React.useContext(SubjectContext)
  if (context === undefined) {
    throw new Error("useSubject must be used within a SubjectProvider")
  }
  return context
}

