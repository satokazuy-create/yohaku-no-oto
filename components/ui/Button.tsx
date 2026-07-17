import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "text" | "icon";
};

// タップ目標44px以上(設計書§21)。primaryは画面幅80%・高さ72px以上(§14 S01)。
export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const base = "min-h-11 min-w-11 transition-colors disabled:cursor-not-allowed";
  const variants = {
    primary:
      "flex h-[72px] w-[80%] max-w-xs items-center justify-center rounded-full bg-[#C9A0A0] px-6 text-base font-medium text-white hover:bg-[#b98f8f] disabled:opacity-60",
    text: "text-sm text-[#7a7a7a] hover:underline disabled:opacity-60",
    icon: "flex flex-col items-center gap-1 text-sm text-[#7a7a7a] disabled:opacity-50",
  } as const;

  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
