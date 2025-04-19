import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTranscript } from "@/hooks/use-transcript"
import { Transcript } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

interface TranscriptModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
}

export function TranscriptModal({ isOpen, onClose, eventId }: TranscriptModalProps) {
  const { transcript, loading, error } = useTranscript(eventId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Check-in Transcript</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        ) : error ? (
          <div className="text-red-500 py-4">Failed to load transcript</div>
        ) : transcript ? (
          <div className="space-y-6">
            <div className="space-y-2">
              {transcript.messages
                .filter((msg) => msg.role !== "system")
                .map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "bot" ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        msg.role === "bot" ? "bg-teal-100 text-teal-900" : "bg-blue-100 text-blue-900"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
            </div>

            {transcript.insights && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium mb-2">AI Insights</h4>
                <p className="text-sm text-gray-700">{transcript.insights}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 py-4">No transcript available</div>
        )}
      </DialogContent>
    </Dialog>
  )
} 