import { Kuu } from "@/components/kuu";
import { ja } from "@/lib/i18n/ja";

// 雛形フェーズの最小プレースホルダー。本格UI(S01ホーム等)は実装フェーズで着手する。
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-[#FAF6EF] px-6 py-32 text-center font-serif">
      <Kuu />
      <h1 className="text-2xl font-medium text-[#4a4a4a]">{ja.appName}</h1>
      <p className="text-sm text-[#7a7a7a]">{ja.tagline}</p>
      <p className="text-xs text-[#a8a8a8]">{ja.placeholderNotice}</p>
    </main>
  );
}
