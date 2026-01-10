import { FeedbackBoard } from "@/components/features/feedback/feedback-board"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-white font-mono p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12 pt-8">
          <Link href="/" className="inline-block mb-8">
            <Button variant="outline" className="rounded-none border-black hover:bg-black hover:text-white transition-colors gap-2">
              <ArrowLeft className="w-4 h-4" />
              BACK_TO_HOME
            </Button>
          </Link>

          <div className="border-l-4 border-black pl-6 py-2">
            <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter mb-2">
              Feedback Hub
            </h1>
            <p className="text-gray-500 uppercase tracking-widest text-sm">
              Community / Suggestions / Bugs
            </p>
          </div>
        </header>

        <main>
          <FeedbackBoard />
        </main>
      </div>

      {/* Decorative Grid */}
      <div
        className="fixed inset-0 z-[-1] opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  )
}
