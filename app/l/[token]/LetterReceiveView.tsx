"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ja } from "@/lib/i18n/ja";
import { LETTER_SOUNDS } from "@/lib/letterOptions";
import { ensureAnonymousSession } from "@/lib/supabase/auth";
import { getLetterByToken, recordLetterPlay, type LetterPreview } from "@/lib/supabase/letters";

type Status = "loading" | "found" | "not-found" | "error";

// S07音の手紙・受信の本体(クライアント側)。受信者は送信者とは別の匿名ユーザーになるため、
// 自分の匿名セッションを用意したうえで、トークンで1件だけ取得するRPCを呼ぶ
// (supabase/migrations/0002:テーブルへの直接selectは送信者本人のみに制限しているため)。
export function LetterReceiveView({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [letter, setLetter] = useState<LetterPreview | null>(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await ensureAnonymousSession();
        const result = await getLetterByToken(token);
        if (cancelled) return;
        if (result) {
          setLetter(result);
          setStatus("found");
        } else {
          setStatus("not-found");
        }
      } catch (err) {
        console.error("音の手紙の読み込みに失敗しました", err);
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handlePlay() {
    setPlayed(true);
    try {
      await recordLetterPlay(token);
    } catch (err) {
      console.error("音の手紙の再生記録に失敗しました", err);
    }
  }

  if (status === "loading") {
    return (
      <main className="safe-bottom flex min-h-dvh flex-1 flex-col items-center justify-center gap-6 bg-[#FAF6EF] px-6 py-16 pb-6 text-center font-serif text-[#3d3833]" />
    );
  }

  if (status === "not-found" || status === "error") {
    return (
      <main className="safe-bottom flex min-h-dvh flex-1 flex-col items-center justify-center gap-6 bg-[#FAF6EF] px-6 py-16 pb-6 text-center font-serif text-[#3d3833]">
        <p className="max-w-xs text-base leading-relaxed">{ja.letterReceive.notFound}</p>
        <Link
          href="/"
          className="min-h-11 text-xs text-[#6b6b6b] underline-offset-4 hover:underline"
        >
          {ja.letterReceive.aboutLink}
        </Link>
      </main>
    );
  }

  const soundLabel = LETTER_SOUNDS.find((s) => s.id === letter?.sound_id)?.label ?? "";

  return (
    <main className="safe-bottom flex min-h-dvh flex-1 flex-col items-center justify-center gap-6 bg-[#FAF6EF] px-6 py-16 pb-6 text-center font-serif text-[#3d3833]">
      <div className="bloom text-5xl" aria-hidden="true">
        🌸
      </div>

      {letter?.phrase && <p className="max-w-xs text-lg leading-relaxed">「{letter.phrase}」</p>}
      {letter?.sender_name && (
        <p className="text-sm text-[#6b6b6b]">
          ── {letter.sender_name} {ja.letterReceive.fromSuffix}
        </p>
      )}

      {played ? (
        <p className="text-sm text-[#6b6b6b]">🌸 {ja.letterReceive.playedNotice}</p>
      ) : (
        <button
          type="button"
          onClick={handlePlay}
          className="flex h-[72px] w-[80%] max-w-xs items-center justify-center rounded-full bg-[#B0613F] px-6 text-base font-medium text-white hover:bg-[#96502F]"
        >
          {ja.letterReceive.playButton}
        </button>
      )}
      {soundLabel && <p className="text-xs text-[#6b6b6b]">{soundLabel}</p>}

      <p className="text-xs text-[#6b6b6b]">{ja.letterReceive.noReplyNotice}</p>

      <Link
        href="/"
        className="min-h-11 text-xs text-[#6b6b6b] underline-offset-4 hover:underline"
      >
        {ja.letterReceive.aboutLink}
      </Link>
    </main>
  );
}
