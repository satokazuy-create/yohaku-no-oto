import { supabase } from "./client";
import type { MoodId } from "@/lib/moods";

// 実音源カタログが未実装のため、requested_duration_sec等は記録しない簡易版。
export async function recordCompletedSession(userId: string, mood: MoodId) {
  const { error } = await supabase.from("sessions").insert({
    user_id: userId,
    mood,
    completed: true,
    ended_at: new Date().toISOString(),
  });
  if (error) throw error;
}
