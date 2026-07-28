"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ja } from "@/lib/i18n/ja";
import { MOOD_GARDEN_FIELD, MOOD_MOCK_CAPTION, MOOD_MOCK_SOUND, isMoodId, type MoodId } from "@/lib/moods";
import { ensureAnonymousSession } from "@/lib/supabase/auth";
import { incrementGardenField } from "@/lib/supabase/garden";
import { recordCompletedSession } from "@/lib/supabase/sessions";

// S03再生・S04振り返りの静的UI試作(設計書§14)。音源・タイマーは未実装(見た目のみ)。
// 「とめる」は画面遷移なしでS04へ切り替える(設計書§13の遷移図に合わせた挙動)。
export function PlayScreen() {
  const searchParams = useSearchParams();
  const moodParam = searchParams.get("mood");
  const mood: MoodId = isMoodId(moodParam) ? moodParam : "none";

  const [phase, setPhase] = useState<"playing" | "reflected">("playing");
  const [showCaption, setShowCaption] = useState(true);
  const [stopping, setStopping] = useState(false);

  async function handleStop() {
    setStopping(true);
    try {
      const session = await ensureAnonymousSession();
      await recordCompletedSession(session.user.id, mood);
      await incrementGardenField(session.user.id, MOOD_GARDEN_FIELD[mood]);
    } catch (err) {
      console.error("庭への記録に失敗しました", err);
      // 接続に失敗しても振り返り画面には進める(体験を止めない)
    } finally {
      setPhase("reflected");
    }
  }

  if (phase === "reflected") {
    return (
      <main className="safe-bottom flex min-h-dvh flex-1 flex-col items-center justify-center gap-6 bg-[#FAF6EF] px-6 py-16 pb-6 text-center font-serif text-[#3d3833]">
        <p className="text-base">
          {ja.reflect.heading}
          <br />
          {ja.reflect.subheading}
        </p>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <Button variant="list" href="/">
            {ja.reflect.relaxed}
          </Button>
          <Button variant="list" href="/">
            {ja.reflect.same}
          </Button>
          <Button variant="list" href="/">
            {ja.reflect.unknown}
          </Button>
        </div>
        <Button variant="text" href="/">
          {ja.reflect.skip}
        </Button>
      </main>
    );
  }

  return (
    <main className="safe-bottom flex min-h-dvh flex-1 flex-col items-center justify-between gap-10 bg-[#24424A] px-6 py-16 pb-6 text-center font-serif text-[#f5efe6]">
      <div aria-hidden="true" />

      <section className="flex flex-col items-center gap-6">
        <div
          className="breathe h-24 w-24 rounded-full border-2 border-[#f5efe6]/80"
          aria-hidden="true"
        />
        <p className="text-sm text-[#f5efe6]/90">{MOOD_MOCK_SOUND[mood]}</p>
        {showCaption && <p className="text-base">「{MOOD_MOCK_CAPTION[mood]}」</p>}
        <button
          type="button"
          onClick={() => setShowCaption((v) => !v)}
          className="min-h-11 min-w-11 text-xs text-[#f5efe6]/75 underline-offset-4 hover:underline"
        >
          字幕 {showCaption ? "ON" : "OFF"}
        </button>
      </section>

      <section className="flex w-full flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleStop}
          disabled={stopping}
          className="min-h-11 flex h-[72px] w-[80%] max-w-xs items-center justify-center rounded-full bg-[#f5efe6] text-base font-medium text-[#1f363c] hover:bg-white disabled:opacity-70"
        >
          {ja.play.stopButton}
        </button>
        <p className="text-xs text-[#f5efe6]/75">
          {ja.play.durationOptions.join(" ▸ ")}
        </p>
      </section>
    </main>
  );
}
