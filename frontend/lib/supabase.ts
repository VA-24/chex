import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Transcript = {
  id: string
  event_id: string
  created_at: string
  messages: {
    role: 'system' | 'user' | 'bot'
    time: number
    message: string
    duration?: number
    secondsFromStart: number
  }[]
  insights?: string
}

export type CheckInEvent = {
  id: string
  date: string
  time: string
  type: string
  event: string
  mood: string
  summary: string
  severity: 'low' | 'medium' | 'high'
  has_checked_in: boolean
  transcript_id?: string
} 