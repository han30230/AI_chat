import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 채팅",
  description: "캐릭터와 대화하기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="min-h-screen bg-black text-zinc-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
