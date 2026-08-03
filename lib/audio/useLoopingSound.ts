"use client";

import { useCallback, useEffect, useRef } from "react";

// 設計書§16.3:フェードイン2秒・フェードアウト3秒を全素材に強制。初回再生は
// デバイス音量の60%を上限とする(端末音量自体は制御できないため、自前のゲインの
// 上限を0.6にすることで近似する。「初回のみ」の判定は行わず、常に上限を適用する
// シンプルな実装にしている)。
const FADE_IN_SEC = 2;
const FADE_OUT_SEC = 3;
const VOLUME_CAP = 0.6;

// HTML5 <audio loop>ではなくWeb Audio APIでデコード済みPCMバッファをループさせる。
// <audio loop>はコーデックのフレーム境界に起因するわずかなギャップが出ることがあり、
// シームレスループが要件(§16.1)のため避けている。
export function useLoopingSound(fileUrl: string | null) {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const stoppedRef = useRef(false);

  useEffect(() => {
    if (!fileUrl) return;
    stoppedRef.current = false;
    let cancelled = false;

    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    ctxRef.current = ctx;

    (async () => {
      try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        if (cancelled) return;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.connect(ctx.destination);
        gainRef.current = gain;

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(gain);
        source.start();
        sourceRef.current = source;

        if (ctx.state === "suspended") {
          await ctx.resume();
        }
        gain.gain.linearRampToValueAtTime(VOLUME_CAP, ctx.currentTime + FADE_IN_SEC);
      } catch (err) {
        console.error("音源の再生に失敗しました", err);
      }
    })();

    return () => {
      cancelled = true;
      if (!stoppedRef.current) {
        sourceRef.current?.stop();
      }
      ctxRef.current?.close().catch(() => {});
      gainRef.current = null;
      sourceRef.current = null;
      ctxRef.current = null;
    };
  }, [fileUrl]);

  // 「とめる」操作から呼ぶ、フェードアウトしてから停止する関数。
  const stop = useCallback(() => {
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    const source = sourceRef.current;
    if (!ctx || !gain || !source || stoppedRef.current) return;
    stoppedRef.current = true;

    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + FADE_OUT_SEC);
    source.stop(now + FADE_OUT_SEC);
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, FADE_OUT_SEC * 1000 + 200);
  }, []);

  return { stop };
}
