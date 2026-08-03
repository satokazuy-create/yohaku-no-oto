"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useLoopingSound } from "@/lib/audio/useLoopingSound";
import { ja } from "@/lib/i18n/ja";
import {
  MOOD_GARDEN_FIELD,
  MOOD_MOCK_CAPTION,
  MOOD_MOCK_SOUND,
  MOOD_SOUND_ID,
  pickOmakaseMood,
  readOmakaseHistory,
  writeOmakaseHistory,
  isMoodId,
  type MoodId,
} from "@/lib/moods";
import { getSoundById } from "@/lib/sounds";
import { ensureAnonymousSession } from "@/lib/supabase/auth";
import { incrementGardenField } from "@/lib/supabase/garden";
import { recordCompletedSession } from "@/lib/supabase/sessions";

// S03再生・S04振り返りの静的UI試作(設計書§14)。タイマーは未実装(見た目のみ)。
// 音源は実装済みだが、実音源を用意できているmoodのみ(lib/moods.tsのMOOD_SOUND_ID参照)。
// 「とめる」は画面遷移なしでS04へ切り替える(設計書§13の遷移図に合わせた挙動)。
export function PlayScreen() {
  const searchParams = useSearchParams();
  const moodParam = searchParams.get("mood");
  const mood: MoodId = isMoodId(moodParam) ? moodParam : "none";

  // mood=none(くぅにまかせる/じぶんで選ぶの「何も選びたくない」)のときだけ、
  // 時間帯の候補プールから実際のmoodを1つ選ぶ(設計書§23「時間帯既定」の簡易版)。
  // この画面はpage.tsxでSSRを無効化しているため、ランダム選択をレンダー中に
  // 行ってもサーバー/クライアント間の食い違い(ハイドレーション不整合)は起きない。
  // 選択(読み取りのみ)と履歴の保存(書き込みのみ)を分離しているのは、
  // Strict Modeでの二重初期化による履歴破損を避けるため(lib/moods.ts参照)。
  const [contentMood] = useState<MoodId>(() =>
    mood === "none" ? pickOmakaseMood(new Date(), readOmakaseHistory()) : mood
  );

  useEffect(() => {
    if (mood === "none") {
      writeOmakaseHistory(contentMood);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [phase, setPhase] = useState<"playing" | "reflected">("playing");
  const [showCaption, setShowCaption] = useState(true);
  const [stopping, setStopping] = useState(false);

  const soundId = MOOD_SOUND_ID[contentMood];
  const soundFile = soundId ? (getSoundById(soundId)?.file ?? null) : null;
  const { stop: stopSound } = useLoopingSound(soundFile);

  async function handleStop() {
    stopSound();
    setStopping(true);
    try {
      const session = await ensureAnonymousSession();
      // 選ばれた実際のmoodを記録・庭への反映の両方に使う(mood=noneのままには残さない)。
      await recordCompletedSession(session.user.id, contentMood);
      await incrementGardenField(session.user.id, MOOD_GARDEN_FIELD[contentMood]);
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
        <p className="text-sm text-[#f5efe6]/90">{MOOD_MOCK_SOUND[contentMood]}</p>
        {showCaption && <p className="text-base">「{MOOD_MOCK_CAPTION[contentMood]}」</p>}
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
