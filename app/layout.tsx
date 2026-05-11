import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="zh-CN">
      <head>
        <link
          rel="stylesheet"
          href="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/font-awesome/6.0.0/css/fontawesome.min.css"
        />
        {/* Inter 字体 - 字节镜像 */}
        <link
          rel="preconnect"
          href="https://fonts.bytedance.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.bytedance.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap"
        />
        {/* 预加载关键图片 */}
        <link
          rel="preload"
          as="image"
          href="/images/team-bg-lqip.webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/team-bg.jpg?x-oss-process=image/resize,w_3840,limit_1/format,webp/quality,Q_100"
        />
        <link
          rel="preload"
          as="image"
          href="/icon.png?x-oss-process=image/resize,w_3840,limit_1/format,webp/quality,Q_100"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
