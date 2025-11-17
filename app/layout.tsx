import type { Metadata } from "next";
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
  title: "Funk & Love - 浙江大学DFM街舞社Locking团队",
  description: "用舞蹈传递快乐。Funk & Love是浙江大学DFM街舞社的Locking团队，我们用充满律动的锁舞诠释放克精神。Lock it, Point it, Groove it!",
  keywords: ["Funk & Love", "Locking", "街舞", "浙江大学", "DFM", "锁舞", "放克", "舞蹈"],
  authors: [{ name: "Hofmann88" }],
  openGraph: {
    title: "Funk & Love - 浙江大学DFM街舞社Locking团队",
    description: "用舞蹈传递快乐 | Lock it, Point it, Groove it!",
    images: ["https://funkandlove-main.s3.bitiful.net/public/icon.png"],
    type: "website",
  },
  icons: {
    icon: "https://funkandlove-main.s3.bitiful.net/public/favicon.ico",
    apple: "https://funkandlove-main.s3.bitiful.net/public/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
