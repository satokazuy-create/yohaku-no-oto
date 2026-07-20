"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ja } from "@/lib/i18n/ja";

type FontSize = "standard" | "large" | "extraLarge";

const FONT_SIZE_OPTIONS: { id: FontSize; label: string }[] = [
  { id: "standard", label: ja.settings.fontSizeStandard },
  { id: "large", label: ja.settings.fontSizeLarge },
  { id: "extraLarge", label: ja.settings.fontSizeExtraLarge },
];

// S10設定の静的UI試作(設計書§14・§21)。値はこの画面内のローカル状態のみで、
// 保存・他画面への反映(実際の文字拡大・端末音量制御・通知登録等)は未実装。
export function SettingsForm() {
  const [fontSize, setFontSize] = useState<FontSize>("standard");
  const [maxVolume, setMaxVolume] = useState(60);
  const [captions, setCaptions] = useState(true);
  const [notifications, setNotifications] = useState(false);

  return (
    <main className="safe-bottom flex min-h-dvh flex-1 flex-col items-center gap-6 bg-[#FAF6EF] px-6 py-10 pb-6 font-serif text-[#3d3833]">
      <h1 className="text-center text-lg">{ja.settings.heading}</h1>

      <div className="flex w-full max-w-sm flex-col gap-4">
        <section className="rounded-2xl border border-[#e5ddd0] bg-white p-4">
          <p className="mb-3 text-sm">{ja.settings.fontSizeLabel}</p>
          <div className="flex gap-2">
            {FONT_SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                aria-pressed={fontSize === opt.id}
                onClick={() => setFontSize(opt.id)}
                className={`min-h-11 flex-1 rounded-xl border px-2 py-2 text-sm transition-colors ${
                  fontSize === opt.id
                    ? "border-[#B0613F] bg-[#B0613F] text-white"
                    : "border-[#e5ddd0] bg-white text-[#3d3833]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#e5ddd0] bg-white p-4">
          <label className="flex flex-col gap-2 text-sm">
            {ja.settings.maxVolumeLabel}
            <input
              type="range"
              min={0}
              max={100}
              value={maxVolume}
              onChange={(e) => setMaxVolume(Number(e.target.value))}
              aria-valuetext={`${maxVolume}%`}
              className="min-h-11 w-full accent-[#B0613F]"
            />
          </label>
        </section>

        <section className="flex min-h-11 items-center justify-between rounded-2xl border border-[#e5ddd0] bg-white p-4">
          <p className="text-sm">{ja.settings.captionsLabel}</p>
          <button
            type="button"
            aria-pressed={captions}
            onClick={() => setCaptions((v) => !v)}
            className="min-h-11 min-w-11 rounded-full border border-[#e5ddd0] px-4 py-2 text-xs text-[#3d3833]"
          >
            {captions ? ja.settings.on : ja.settings.off}
          </button>
        </section>

        <section className="flex min-h-11 items-center justify-between rounded-2xl border border-[#e5ddd0] bg-white p-4 opacity-50">
          <p className="text-sm">{ja.settings.vibrationLabel}</p>
          <span className="text-xs text-[#6b6b6b]">{ja.settings.comingSoon}</span>
        </section>

        <section className="flex min-h-11 items-center justify-between rounded-2xl border border-[#e5ddd0] bg-white p-4">
          <p className="text-sm">{ja.settings.notificationsLabel}</p>
          <button
            type="button"
            aria-pressed={notifications}
            onClick={() => setNotifications((v) => !v)}
            className="min-h-11 min-w-11 rounded-full border border-[#e5ddd0] px-4 py-2 text-xs text-[#3d3833]"
          >
            {notifications ? ja.settings.on : ja.settings.off}
          </button>
        </section>

        <button
          type="button"
          disabled
          aria-label={`${ja.settings.dataHandoffLabel}(${ja.settings.comingSoon})`}
          className="min-h-11 flex items-center justify-between rounded-2xl border border-[#e5ddd0] bg-white p-4 text-left text-sm opacity-50 disabled:cursor-not-allowed"
        >
          <span>{ja.settings.dataHandoffLabel}</span>
          <span aria-hidden="true">▸</span>
        </button>

        <Button
          variant="text"
          href="/safety"
          className="flex items-center justify-between rounded-2xl border border-[#e5ddd0] bg-white p-4 text-left"
        >
          <span>{ja.settings.safetyLink}</span>
          <span aria-hidden="true">▸</span>
        </Button>
      </div>

      <Button variant="text" href="/">
        {ja.settings.backLink}
      </Button>
    </main>
  );
}
