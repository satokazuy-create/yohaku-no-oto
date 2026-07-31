"use client";

import { useEffect, useState } from "react";
import { GardenScene } from "@/components/garden/GardenScene";
import { Kuu } from "@/components/kuu";
import { Button } from "@/components/ui/Button";
import { ja } from "@/lib/i18n/ja";
import { ensureAnonymousSession } from "@/lib/supabase/auth";
import {
  describeGardenState,
  getOrCreateGardenState,
  type GardenState,
} from "@/lib/supabase/garden";

// S05サウンドガーデン(設計書§14・§17)。garden_stateをSupabaseから読み込んで表示する。
// 数値・グラフ・日数は表示しない(設計書§17.3禁止事項)。
export function GardenView() {
  const [state, setState] = useState<GardenState | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const session = await ensureAnonymousSession();
        const loaded = await getOrCreateGardenState(session.user.id);
        if (!cancelled) {
          setState(loaded);
          setMessage(describeGardenState(loaded));
        }
      } catch (err) {
        console.error("庭の読み込みに失敗しました", err);
        // 接続に失敗しても静的な既定文言で体験を止めない(絵は表示しない)
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

      <section className="w-full max-w-xs overflow-hidden rounded-3xl shadow-sm">
        {state ? (
          <GardenScene state={state} />
        ) : (
          <div aria-hidden="true" className="h-[125px] w-full bg-[#e9f0e6]" />
        )}
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
