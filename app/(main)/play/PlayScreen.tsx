"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ja } from "@/lib/i18n/ja";
import { MOOD_MOCK_CAPTION, MOOD_MOCK_SOUND, isMoodId, type MoodId } from "@/lib/moods";

// S03再生・S04振り返りの静的UI試作(設計書§14)。音源・タイマーは未実装(見た目のみ)。
// 「とめる」は画面遷移なしでS04へ切り替える(設計書§13の遷移図に合わせた挙動)。
export function PlayScreen() {
  const searchParams = useSearchParams();
  const moodParam = searchParams.get("mood");
  const mood: MoodId = isMoodId(moodParam) ? moodParam : "none";

  const [phase, setPhase] = useState<"playing" | "reflected">("playing");
  const [showCaption, setShowCaption] = useState(true);

  if (phase === "reflected") {
    return (
      <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-6 bg-[#FAF6EF] px-6 py-16 text-center font-serif text-[#4a4a4a]">
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
    <main className="flex min-h-screen flex-1 flex-col items-center justify-between gap-10 bg-[#2e2b28] px-6 py-16 text-center font-serif text-[#f5efe6]">
      <div aria-hidden="true" />

      <section className="flex flex-col items-center gap-6">
        <div
          className="breathe h-24 w-24 rounded-full border border-[#f5efe6]/60"
          aria-hidden="true"
        />
        <p className="text-sm text-[#f5efe6]/80">{MOOD_MOCK_SOUND[mood]}</p>
        {showCaption && <p className="text-base">「{MOOD_MOCK_CAPTION[mood]}」</p>}
        <button
          type="button"
          onClick={() => setShowCaption((v) => !v)}
          className="min-h-11 min-w-11 text-xs text-[#f5efe6]/60 underline-offset-4 hover:underline"
        >
          字幕 {showCaption ? "ON" : "OFF"}
        </button>
      </section>

      <section className="flex w-full flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => setPhase("reflected")}
          className="min-h-11 flex h-[72px] w-[80%] max-w-xs items-center justify-center rounded-full bg-[#f5efe6] text-base font-medium text-[#2e2b28] hover:bg-white"
        >
          {ja.play.stopButton}
        </button>
        <p className="text-xs text-[#f5efe6]/60">
          {ja.play.durationOptions.join(" ▸ ")}
        </p>
      </section>
    </main>
  );
}
