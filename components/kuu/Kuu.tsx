import Image from "next/image";

export type KuuExpression = "neutral" | "lean-in" | "affirm" | "release" | "nudge";

const EXPRESSION_SRC: Record<KuuExpression, string> = {
  neutral: "/kuu/neutral.png",
  "lean-in": "/kuu/lean-in.png",
  affirm: "/kuu/affirm.png",
  release: "/kuu/release.png",
  nudge: "/kuu/nudge.png",
};

type KuuProps = {
  expression?: KuuExpression;
  size?: number;
  className?: string;
};

// 設計書§14/MVP仕様書§12.1b:くぅのビジュアル(2026-07-17差し替え。出所はcomponents/kuu/README.md参照)。
// 将来さらに差し替える際も、呼び出し側(index.ts経由の利用者)を変更せずに済むようにする。
export function Kuu({ expression = "neutral", size = 96, className }: KuuProps) {
  return (
    <Image
      src={EXPRESSION_SRC[expression]}
      alt="くぅ"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
      priority
    />
  );
}
