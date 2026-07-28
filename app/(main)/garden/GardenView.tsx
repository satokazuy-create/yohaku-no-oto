"use client";

import { useEffect, useState } from "react";
import { Kuu } from "@/components/kuu";
import { Button } from "@/components/ui/Button";
import { ja } from "@/lib/i18n/ja";
import { ensureAnonymousSession } from "@/lib/supabase/auth";
import { describeGardenState, getOrCreateGardenState } from "@/lib/supabase/garden";

// S05サウンドガーデン(設計書§14・§17)。garden_stateをSupabaseから読み込んで表示する。
// 数値・グラフ・日数は表示しない(設計書§17.3禁止事項)。
export function GardenView() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const session = await ensureAnonymousSession();
        const state = await getOrCreateGardenState(session.user.id);
        if (!cancelled) setMessage(describeGardenState(state));
      } catch (err) {
        console.error("庭の読み込みに失敗しました", err);
        // 接続に失敗しても静的な既定文言で体験を止めない
        if (!cancelled) setMessage(ja.garden.message);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="safe-bottom flex min-h-dvh flex-1 flex-col items-center justify-between gap-10 bg-gradient-to-b from-[#e9f0e6] to-[#FAF6EF] px-6 py-16 pb-6 text-center font-serif text-[#3d3833]">
      <div aria-hidden="true" />

      <section
        aria-hidden="true"
        className="flex h-40 w-full max-w-xs items-end justify-center rounded-t-full bg-[#d7e4d0]/60"
      >
        <div className="mb-0 h-12 w-full rounded-t-full bg-[#bcd2c8]/70" />
      </section>

      <section className="flex flex-col items-center gap-4">
        <Kuu className="kuu-float" size={72} />
        <p className="min-h-6 text-base leading-relaxed">{message ?? ""}</p>
      </section>

      <Button variant="text" href="/">
        {ja.garden.backLink}
      </Button>
    </main>
  );
}
