"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { APP_URL } from "@/lib/config";
import { ja } from "@/lib/i18n/ja";
import { LETTER_PHRASES, LETTER_SOUNDS, type LetterSoundId } from "@/lib/letterOptions";
import { ensureAnonymousSession } from "@/lib/supabase/auth";
import { createLetter } from "@/lib/supabase/letters";

type Phase = "sound" | "phrase" | "preview" | "done";

// S06音の手紙・作成(設計書§14・§19.1)。3ステップ+プレビュー。
// 「リンクをつくる」で実際にSupabaseのlettersテーブルへ保存する(supabase/migrations/0002)。
export function LetterForm() {
  const [phase, setPhase] = useState<Phase>("sound");
  const [soundId, setSoundId] = useState<LetterSoundId | null>(null);
  const [phrase, setPhrase] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(false);

  const soundLabel = LETTER_SOUNDS.find((s) => s.id === soundId)?.label ?? "";

  async function handleCreateLink() {
    if (!soundId || !phrase) return;
    setCreating(true);
    setCreateError(false);
    try {
      const session = await ensureAnonymousSession();
      const newToken = await createLetter(session.user.id, {
        soundId,
        phrase,
        senderName: name,
      });
      setToken(newToken);
      setPhase("done");
    } catch (err) {
      console.error("音の手紙の作成に失敗しました", err);
      setCreateError(true);
    } finally {
      setCreating(false);
    }
  }

  if (phase === "done") {
    const letterPath = `/l/${token}`;

    return (
      <main className="safe-bottom flex min-h-dvh flex-1 flex-col items-center justify-center gap-6 bg-[#FAF6EF] px-6 py-16 pb-6 text-center font-serif text-[#3d3833]">
        <p className="text-base">{ja.letter.doneHeading}</p>
        <Link
          href={letterPath}
          className="w-full max-w-xs break-all rounded-2xl border border-[#e5ddd0] bg-white px-4 py-3 text-xs text-[#5a5a5a] underline-offset-4 hover:underline"
        >
          {APP_URL}
          {letterPath}
        </Link>
        <p className="text-xs text-[#6b6b6b]">{ja.letter.doneNotice}</p>
        <Button variant="text" href="/">
          {ja.letter.homeLink}
        </Button>
      </main>
    );
  }

  return (
    <main className="safe-bottom flex min-h-dvh flex-1 flex-col items-center gap-6 bg-[#FAF6EF] px-6 py-16 pb-6 font-serif text-[#3d3833]">
      <p className="text-xs text-[#6b6b6b]">
        {phase === "sound" ? "1" : phase === "phrase" ? "2" : "3"} / 3
      </p>

      {phase === "sound" && (
        <>
          <h1 className="text-center text-lg">{ja.letter.stepSoundHeading}</h1>
          <div className="grid w-full max-w-xs grid-cols-2 gap-3">
            {LETTER_SOUNDS.map((sound) => (
              <Button
                key={sound.id}
                variant="list"
                onClick={() => {
                  setSoundId(sound.id);
                  setPhase("phrase");
                }}
              >
                {sound.label}
              </Button>
            ))}
          </div>
          <Button variant="text" href="/">
            {ja.letter.homeLink}
          </Button>
        </>
      )}

      {phase === "phrase" && (
        <>
          <h1 className="text-center text-lg">{ja.letter.stepPhraseHeading}</h1>
          <div className="flex w-full max-w-xs flex-col gap-3">
            {LETTER_PHRASES.map((text) => (
              <Button
                key={text}
                variant="listAuto"
                onClick={() => {
                  setPhrase(text);
                  setPhase("preview");
                }}
              >
                {text}
              </Button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPhase("sound")}
            className="min-h-11 text-sm text-[#5a5a5a] hover:underline"
          >
            {ja.letter.backLink}
          </button>
        </>
      )}

      {phase === "preview" && (
        <>
          <h1 className="text-center text-lg">{ja.letter.stepPreviewHeading}</h1>
          <div className="w-full max-w-xs rounded-2xl border border-[#e5ddd0] bg-white p-5 text-center">
            <p className="text-sm text-[#6b6b6b]">{soundLabel}</p>
            <p className="mt-2 text-base leading-relaxed">「{phrase}」</p>
          </div>

          <label className="flex w-full max-w-xs flex-col gap-1 text-sm text-[#5a5a5a]">
            {ja.letter.nameLabel}
            <input
              type="text"
              value={name}
              maxLength={10}
              onChange={(e) => setName(e.target.value)}
              className="min-h-11 rounded-xl border border-[#e5ddd0] bg-white px-3 py-2 text-[#3d3833]"
            />
          </label>

          {createError && (
            <p className="text-xs text-[#B0613F]">{ja.letter.createError}</p>
          )}

          <Button variant="primary" onClick={handleCreateLink} disabled={creating}>
            {ja.letter.createLinkButton}
          </Button>

          <button
            type="button"
            onClick={() => setPhase("phrase")}
            className="min-h-11 text-sm text-[#5a5a5a] hover:underline"
          >
            {ja.letter.backLink}
          </button>
        </>
      )}
    </main>
  );
}
