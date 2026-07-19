import Link from "next/link";
import { ja } from "@/lib/i18n/ja";
import { LETTER_SOUNDS } from "@/lib/letterOptions";

type Props = {
  searchParams: Promise<{ sound?: string; phrase?: string; name?: string }>;
};

// S07音の手紙・受信の静的UI試作(設計書§14・§19.1)。認証不要・アプリ未インストールでも開ける想定。
// 実装フェーズではトークンからSSRでDB参照する(§23 GET /api/letters/:token)が、
// 静的UI試作段階ではS06発行のモックURLのクエリパラメータから表示内容を復元しているだけで、
// 実際のリンク保存・有効期限・再生記録は未実装。
export default async function LetterReceivePage({ searchParams }: Props) {
  const params = await searchParams;
  const soundLabel = LETTER_SOUNDS.find((s) => s.id === params.sound)?.label ?? "";
  const phrase = params.phrase ? decodeURIComponent(params.phrase) : "";
  const name = params.name ? decodeURIComponent(params.name) : "";

  return (
    <main className="safe-bottom flex min-h-dvh flex-1 flex-col items-center justify-center gap-6 bg-[#FAF6EF] px-6 py-16 pb-6 text-center font-serif text-[#3d3833]">
      <div className="bloom text-5xl" aria-hidden="true">
        🌸
      </div>

      {phrase && <p className="max-w-xs text-lg leading-relaxed">「{phrase}」</p>}
      {name && (
        <p className="text-sm text-[#6b6b6b]">
          ── {name} {ja.letterReceive.fromSuffix}
        </p>
      )}

      <button
        type="button"
        disabled
        aria-label={`${ja.letterReceive.playButton}(${ja.letterReceive.playComingSoon})`}
        className="flex h-[72px] w-[80%] max-w-xs items-center justify-center rounded-full bg-[#B0613F] px-6 text-base font-medium text-white opacity-60 disabled:cursor-not-allowed"
      >
        {ja.letterReceive.playButton}
      </button>
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
