"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { APP_URL } from "@/lib/config";
import { ja } from "@/lib/i18n/ja";
import { LETTER_PHRASES, LETTER_SOUNDS, type LetterSoundId } from "@/lib/letterOptions";

type Phase = "sound" | "phrase" | "preview" | "done";

// S06音の手紙・作成の静的UI試作(設計書§14・§19.1)。3ステップ+プレビュー。
// リンク発行はモック(クライアント側でランダム文字列を生成するのみ、実際のURL発行・DB保存は未実装)。
export function LetterForm() {
  const [phase, setPhase] = useState<Phase>("sound");
  const [soundId, setSoundId] = useState<LetterSoundId | null>(null);
  const [phrase, setPhrase] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [mockToken, setMockToken] = useState("");

  const soundLabel = LETTER_SOUNDS.find((s) => s.id === soundId)?.label ?? "";

  if (phase === "done") {
    return (
      <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-6 bg-[#FAF6EF] px-6 py-16 text-center font-serif text-[#4a4a4a]">
        <p className="text-base">{ja.letter.doneHeading}</p>
        <p className="w-full max-w-xs break-all rounded-2xl border border-[#e5ddd0] bg-white px-4 py-3 text-xs text-[#7a7a7a]">
          {APP_URL}/l/{mockToken}
        </p>
        <p className="text-xs text-[#a8a8a8]">{ja.letter.doneNotice}</p>
        <Button variant="text" href="/">
          {ja.letter.homeLink}
        </Button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center gap-6 bg-[#FAF6EF] px-6 py-16 font-serif text-[#4a4a4a]">
      <p className="text-xs text-[#a8a8a8]">
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
            className="min-h-11 text-sm text-[#7a7a7a] hover:underline"
          >
            {ja.letter.backLink}
          </button>
        </>
      )}

      {phase === "preview" && (
        <>
          <h1 className="text-center text-lg">{ja.letter.stepPreviewHeading}</h1>
          <div className="w-full max-w-xs rounded-2xl border border-[#e5ddd0] bg-white p-5 text-center">
            <p className="text-sm text-[#a8a8a8]">{soundLabel}</p>
            <p className="mt-2 text-base leading-relaxed">「{phrase}」</p>
          </div>

          <label className="flex w-full max-w-xs flex-col gap-1 text-sm text-[#7a7a7a]">
            {ja.letter.nameLabel}
            <input
              type="text"
              value={name}
              maxLength={10}
              onChange={(e) => setName(e.target.value)}
              className="min-h-11 rounded-xl border border-[#e5ddd0] bg-white px-3 py-2 text-[#4a4a4a]"
            />
          </label>

          <Button
            variant="primary"
            onClick={() => {
              setMockToken(Math.random().toString(36).slice(2, 10));
              setPhase("done");
            }}
          >
            {ja.letter.createLinkButton}
          </Button>

          <button
            type="button"
            onClick={() => setPhase("phrase")}
            className="min-h-11 text-sm text-[#7a7a7a] hover:underline"
          >
            {ja.letter.backLink}
          </button>
        </>
      )}
    </main>
  );
}
