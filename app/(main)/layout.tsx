import Link from "next/link";
import { ja } from "@/lib/i18n/ja";

// 設計書§15.4:「安心して使うために」への静かな導線を全画面フッターに常設する。
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col">
      {children}
      <Link
        href="/safety"
        className="fixed bottom-2 right-3 min-h-11 min-w-11 px-2 py-2 text-[11px] text-[#8a8a8a] underline-offset-4 hover:text-[#4a4a4a] hover:underline"
      >
        {ja.safety.footerLink}
      </Link>
    </div>
  );
}
