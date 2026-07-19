import Image from "next/image";

export type KuuExpression = "neutral" | "lean-in" | "affirm" | "release" | "nudge";

// 2026-07-19:背景透過・トリム済みの画像に差し替え(components/kuu/README.md参照)。
// トリムにより表情ごとにアスペクト比が異なるため、実ピクセル寸法を保持し引き伸ばしを防ぐ。
const EXPRESSIONS: Record<KuuExpression, { src: string; width: number; height: number }> = {
  neutral: { src: "/kuu/neutral.png", width: 331, height: 338 },
  "lean-in": { src: "/kuu/lean-in.png", width: 351, height: 333 },
  affirm: { src: "/kuu/affirm.png", width: 325, height: 350 },
  release: { src: "/kuu/release.png", width: 380, height: 307 },
  nudge: { src: "/kuu/nudge.png", width: 306, height: 350 },
};

type KuuProps = {
  expression?: KuuExpression;
  size?: number;
  className?: string;
};

// 設計書§14/MVP仕様書§12.1b:くぅのビジュアル(2026-07-17差し替え。出所はcomponents/kuu/README.md参照)。
// 将来さらに差し替える際も、呼び出し側(index.ts経由の利用者)を変更せずに済むようにする。
// size は縦横の長い方に対する上限(bounding box)として扱い、比率を維持して縮小する。
export function Kuu({ expression = "neutral", size = 96, className }: KuuProps) {
  const { src, width, height } = EXPRESSIONS[expression];
  const scale = size / Math.max(width, height);
  const renderWidth = Math.round(width * scale);
  const renderHeight = Math.round(height * scale);

  return (
    <Image
      src={src}
      alt="くぅ"
      width={renderWidth}
      height={renderHeight}
      className={className}
      style={{ width: renderWidth, height: renderHeight }}
      priority
    />
  );
}
