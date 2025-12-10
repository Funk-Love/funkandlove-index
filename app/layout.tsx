import type { Metadata } from "next";
import "./globals.css";

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
      <head>
        <link
          rel="stylesheet"
          href="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/font-awesome/6.0.0/css/fontawesome.min.css"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'Geist';
                src: url('https://lf3-cdn-tos.bytecdntp.com/cdn/expire-100-M/geist/1.0.0/Geist-Regular.woff2') format('woff2');
                font-weight: 400;
                font-style: normal;
                font-display: swap;
              }
              @font-face {
                font-family: 'Geist';
                src: url('https://lf3-cdn-tos.bytecdntp.com/cdn/expire-100-M/geist/1.0.0/Geist-Medium.woff2') format('woff2');
                font-weight: 500;
                font-style: normal;
                font-display: swap;
              }
              @font-face {
                font-family: 'Geist';
                src: url('https://lf3-cdn-tos.bytecdntp.com/cdn/expire-100-M/geist/1.0.0/Geist-Bold.woff2') format('woff2');
                font-weight: 700;
                font-style: normal;
                font-display: swap;
              }
              @font-face {
                font-family: 'Geist Mono';
                src: url('https://lf3-cdn-tos.bytecdntp.com/cdn/expire-100-M/geist/1.0.0/GeistMono-Regular.woff2') format('woff2');
                font-weight: 400;
                font-style: normal;
                font-display: swap;
              }
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
