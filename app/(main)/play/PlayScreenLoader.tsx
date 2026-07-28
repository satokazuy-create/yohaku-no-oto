"use client";

import dynamic from "next/dynamic";

// next/dynamicの ssr:false はクライアントコンポーネントの中でしか使えないため、
// page.tsx(サーバーコンポーネント)とPlayScreen本体の間にこの薄いラッパーを挟む。
const PlayScreen = dynamic(() => import("./PlayScreen").then((mod) => mod.PlayScreen), {
  ssr: false,
});

export function PlayScreenLoader() {
  return <PlayScreen />;
}
