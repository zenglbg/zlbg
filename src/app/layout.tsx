import './globals.css';
import 'antd/dist/reset.css';  // 添加这行
import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { GA_MEASUREMENT_ID } from '@/lib/ga'
import Script from 'next/script'
import { Analytics } from './providers'
import { FFmpegProvider } from '@/contexts/FFmpegContext';
import SponsorButton from '@/components/SponsorButton';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

export const metadata: Metadata = {
  title: 'ZLBG.CC | 在线音视频处理工具',
  description: '基于 FFmpeg 的在线音视频处理工具，提供视频转码、剪辑、合并等功能。同时集成了正则表达式测试、颜色转换、二维码生成等实用工具。',
  keywords: 'FFmpeg, 视频处理, 在线工具, 正则表达式, 颜色转换, 二维码生成, Next.js, React',
}

 

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  
  return (
    <html lang={locale}>
      <head>
        <script src="https://unpkg.com/@ffmpeg/ffmpeg@0.9.5/dist/ffmpeg.min.js"></script>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <Script
          id="baidu-analytics"
          strategy="lazyOnload"
          crossOrigin="anonymous"
          dangerouslySetInnerHTML={{
            __html: `
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?6f56de0cfb1b9f431228ff619bd0bcc8";
                hm.crossOrigin = "anonymous";
                hm.defer = true;
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
              })();
            `,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>

          {children}
          <SponsorButton />
          <Analytics />
          <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}