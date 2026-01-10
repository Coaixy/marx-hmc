"use client"

import { motion } from "framer-motion"

interface ExamEndedScreenProps {
  examEndDate?: Date
  examName?: string
}

export function ExamEndedScreen({ 
  examEndDate = new Date("2026-01-10T00:00:00"), 
  examName = "综合模拟考试" 
}: ExamEndedScreenProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono text-black selection:bg-black selection:text-white">
      {/* Dot Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Main Container - Neo-Brutalist / Technical */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="relative z-10 w-full max-w-md bg-white border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        {/* Header Bar */}
        <div className="border-b border-black p-3 flex justify-between items-center bg-gray-50">
           <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full border border-black bg-transparent" />
             <div className="w-3 h-3 rounded-full border border-black bg-black" />
           </div>
           <span className="text-[10px] font-bold uppercase tracking-widest">System_Halt</span>
        </div>

        {/* Content Area */}
        <div className="p-8 md:p-12 flex flex-col items-center text-center space-y-8">
          
          {/* Icon/Status */}
          <div className="relative">
             <div className="w-16 h-16 border border-black flex items-center justify-center rounded-full">
                <div className="w-2 h-2 bg-black rounded-full animate-ping absolute" />
                <div className="w-3 h-3 bg-black rounded-full relative z-10" />
             </div>
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter uppercase">
              Exam Ended
            </h1>
            <div className="h-px w-20 bg-black mx-auto" />
            <p className="text-xs uppercase tracking-widest font-bold">
              {examName}
            </p>
          </div>

          {/* Data Table */}
          <div className="w-full border-t border-black border-dashed pt-6 space-y-3">
             <div className="flex justify-between text-xs">
               <span className="opacity-50">CLOSE_DATE</span>
               <span className="font-bold">{formatDate(examEndDate)}</span>
             </div>
             <div className="flex justify-between text-xs">
               <span className="opacity-50">SESSION_ID</span>
               <span className="font-bold">END_OF_TERM_2026</span>
             </div>
             <div className="flex justify-between text-xs items-center">
               <span className="opacity-50">STATUS</span>
               <span className="bg-black text-white px-1.5 py-0.5 text-[10px]">TERMINATED</span>
             </div>
          </div>
          
        </div>

        {/* Technical Footer */}
        <div className="bg-black text-white p-3 text-[10px] uppercase flex justify-between tracking-widest">
           <span>Marix System</span>
           <span>v2.0.26</span>
        </div>
      </motion.div>

      {/* Decorative Technical Lines */}
      <div className="absolute top-8 left-8 w-4 h-4 border-l-2 border-t-2 border-black" />
      <div className="absolute top-8 right-8 w-4 h-4 border-r-2 border-t-2 border-black" />
      <div className="absolute bottom-8 left-8 w-4 h-4 border-l-2 border-b-2 border-black" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-r-2 border-b-2 border-black" />

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-[0.2em] opacity-40 whitespace-nowrap">
        ACCESS DENIED // 拒绝访问
      </div>
    </div>
  )
}
