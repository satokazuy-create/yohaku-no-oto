"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ja } from "@/lib/i18n/ja";

// 設計書§15.4:「安心して使うために」への静かな導線を全画面フッターに常設する。
// S03(再生画面)は夜色の背景になるため、白いチップに乗せてどの画面背景でも視認できるようにする。
// 現在地(/safety)にいるときは強調表示にする(2026-07-19実機フィードバック:選択中が分かるように)。
export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === "/safety";

  return (
    <div className="relative flex min-h-screen flex-1 flex-col">
      {children}
      <Link
        href="/safety"
        aria-current={isActive ? "page" : undefined}
        className={`fixed bottom-[calc(0.5rem+env(safe-area-inset-bottom))] right-3 flex min-h-11 min-w-11 items-center rounded-full px-3 py-2 text-xs shadow-sm transition-colors ${
          isActive
            ? "bg-[#B0613F] font-medium text-white"
            : "bg-white/90 text-[#3d3833] hover:bg-white"
        }`}
      >
        {ja.safety.footerLink}
      </Link>
    </div>
  );
}
