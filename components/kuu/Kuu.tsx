type KuuProps = {
  size?: number;
  className?: string;
};

// 設計書§14/MVP仕様書§12.1:くぅのビジュアルはシンプルなSVG(暫定)。
// 将来イラスト・AI生成画像へ差し替える際、呼び出し側(index.ts経由の利用者)を変更せずに
// この内部実装だけを差し替えられるようにする。
export function Kuu({ size = 96, className }: KuuProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="くぅ"
      className={className}
    >
      <ellipse cx="50" cy="55" rx="38" ry="22" fill="#C9A0A0" opacity="0.35" />
      <ellipse cx="35" cy="45" rx="20" ry="16" fill="#C9A0A0" opacity="0.35" />
      <ellipse cx="65" cy="45" rx="20" ry="16" fill="#C9A0A0" opacity="0.35" />
    </svg>
  );
}
