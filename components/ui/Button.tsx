import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "text" | "icon" | "list" | "listAuto";

const BASE = "min-h-11 min-w-11 transition-colors disabled:cursor-not-allowed";

const VARIANTS: Record<Variant, string> = {
  primary:
    "flex h-[72px] w-[80%] max-w-xs items-center justify-center rounded-full bg-[#C9A0A0] px-6 text-base font-medium text-white hover:bg-[#b98f8f] disabled:opacity-60",
  text: "text-sm text-[#7a7a7a] hover:underline disabled:opacity-60",
  icon: "flex flex-col items-center gap-1 text-sm text-[#7a7a7a] disabled:opacity-50",
  list: "flex h-16 w-full items-center justify-center rounded-2xl border border-[#e5ddd0] bg-white px-6 text-base text-[#4a4a4a] hover:border-[#C9A0A0] disabled:opacity-60",
  // listAuto: 定型文など文字数が可変な選択肢向け(S06)。高さ固定にせず折り返しを許可する。
  listAuto:
    "flex min-h-16 w-full items-center justify-center rounded-2xl border border-[#e5ddd0] bg-white px-6 py-3 text-center text-sm leading-relaxed text-[#4a4a4a] hover:border-[#C9A0A0] disabled:opacity-60",
};

type ButtonAsButton = { variant?: Variant; className?: string; href?: undefined } & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
>;

type ButtonAsLink = { variant?: Variant; className?: string; href: string } & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "className" | "href"
>;

type ButtonProps = ButtonAsButton | ButtonAsLink;

// タップ目標44px以上(設計書§21)。primaryは画面幅80%・高さ72px以上(§14 S01)。
// listはS02気分選択の縦積みボタン(各64px、設計書§14)。「何も選びたくない」も他と同格の見た目にする。
// href を渡すとNext.jsのLinkとして描画する(<button>の中に<a>を入れない)。
export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props;
    return <Link href={href} className={classes} {...rest} />;
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return <button type={type} className={classes} {...rest} />;
}
