import { useEffect, useState } from 'react';
import OpenAI from 'openai';

interface CheckInData {
  transcript: Array<{
    role: string;
    time: number;
    message: string;
    endTime?: number;
    duration?: number;
    secondsFromStart: number;
    source?: string;
  }>;
  has_occurred: boolean;
  appointment_recommended: boolean;
}

interface ProcessedCheckIn {
  summary: string;
  transcript: string;
  has_occurred: boolean;
  appointment_recommended: boolean;
}

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true // Required for client-side usage
});

export function useCheckInData() {
  const [checkInData, setCheckInData] = useState<ProcessedCheckIn | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/db.json');
        const data = await response.json();
        console.log('Fetched data:', data);
        
        if (!data.check_in || !data.check_in.transcript || data.check_in.transcript.length === 0) {
          setCheckInData(null);
          setLoading(false);
          return;
        }

        // Extract user messages for summary
        const userMessages = data.check_in.transcript
          .filter((msg: any) => msg.role === 'user')
          .map((msg: any) => msg.message)
          .join('\n');

        // Get summary from GPT
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that summarizes mental health check-in conversations in a brief, professional manner."
            },
            {
              role: "user",
              content: `Please provide a brief 1-2 sentence summary of this mental health check-in conversation:\n${userMessages}`
            }
          ]
        });

        const summary = completion.choices[0]?.message?.content || "Check-in completed";

        // Format transcript for display
        const transcript = data.check_in.transcript
          .filter((msg: any) => msg.role !== 'system')
          .map((msg: any) => `${msg.role === 'bot' ? 'Chex' : 'You'}: ${msg.message}`)
          .join('\n\n');

        setCheckInData({
          summary,
          transcript,
          has_occurred: data.check_in.has_occurred,
          appointment_recommended: data.check_in.appointment_recommended
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { checkInData, loading, error };
} 