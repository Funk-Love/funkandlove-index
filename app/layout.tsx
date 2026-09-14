import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Inter 可变字体,本地自托管(app/fonts/,latin 子集,300-900 字重)。
 * 之前走字节镜像 fonts.bytedance.com,该服务已下线(404),线上一直回退到 system-ui。
 * 通过 --font-inter 变量暴露给 globals.css。
 */
const inter = localFont({
  src: "./fonts/Inter-variable.woff2",
  weight: "300 900",
  display: "swap",
  variable: "--font-inter",
});

/**
 * Righteous:70s 风格展示标题字体(拉丁子集,中文回退系统黑体,见 globals.css --font-display)。
 */
const righteous = localFont({
  src: "./fonts/Righteous-latin.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-righteous",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://funk-and.love"
  ),
  title: "Funk & Love - 浙江大学DFM街舞社Locking团队",
  description: "用舞蹈传递快乐。Funk & Love是浙江大学DFM街舞社的Locking团队，我们用充满律动的锁舞诠释放克精神。Lock it, Point it, Groove it!",
  keywords: ["Funk & Love", "Locking", "街舞", "浙江大学", "DFM", "锁舞", "放克", "舞蹈"],
  authors: [{ name: "Hofmann88" }],
  openGraph: {
    title: "Funk & Love - 浙江大学DFM街舞社Locking团队",
    description: "用舞蹈传递快乐 | Lock it, Point it, Groove it!",
    images: ["/icon.png"],
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${righteous.variable}`}>
      <head>
        {/* Hero's responsive poster owns first-screen image priority. Team photography loads in its section. */}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
