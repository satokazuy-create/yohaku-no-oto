import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// color-scheme: "light only" で、端末のダークモード設定による自動反転(Android Chromeの
// 「Webサイトを自動的に暗くする」等)を止める。Next.jsのViewport型は"only"修飾子を
// 型として持たないため、metadata.other で直接 <meta name="color-scheme"> を出力する
// (2026-07-19実機再確認:"light"単体では一部端末で反転が止まらなかったため強化)。
export const metadata: Metadata = {
  title: "余白の音",
  description: "こころに羽を。からだに余白を。",
  other: {
    "color-scheme": "light only",
  },
};

// viewportFit: "cover" は safe-area-inset-* を有効にするために必要。
export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
