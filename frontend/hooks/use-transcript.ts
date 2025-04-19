import { useState, useEffect } from 'react'
import { supabase, Transcript } from '@/lib/supabase'

export function useTranscript(eventId: string) {
  const [transcript, setTranscript] = useState<Transcript | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchTranscript() {
      try {
        const { data, error } = await supabase
          .from('call_transcripts')
          .select('*')
          .eq('event_id', eventId)
          .single()

        if (error) throw error

        setTranscript(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchTranscript()
    }
  }, [eventId])

  return { transcript, loading, error }
} 