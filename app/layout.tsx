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

export const metadata: Metadata = {
  title: "余白の音",
  description: "こころに羽を。からだに余白を。",
};

// colorScheme: "light" で、端末のダークモード設定による自動反転(Android Chromeの
// 簡易ダークテーマ等)を止める。MVPでは明るい固定テーマのみをサポートする。
// viewportFit: "cover" は safe-area-inset-* を有効にするために必要。
export const viewport: Viewport = {
  colorScheme: "light",
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
