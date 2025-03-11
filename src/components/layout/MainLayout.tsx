'use client'
import Link from "next/link";
import Image from "next/image";
import { Layout, Space, Typography } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const trackEvent = (action: string, category: string, label: string) => {
  // @ts-ignore
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
  })
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout className="min-h-screen bg-[#f7f4ed]">
      <Header className="flex items-center justify-between px-6" style={{ backgroundColor: '#557571' }}>
        <Title level={4} style={{ margin: 0, color: '#f7f4ed' }}>ZLBG.CC</Title>
        <nav>
          <Space size="large">
            <Link
              href="/"
              onClick={() => trackEvent('click', 'navigation', 'home')}
              className="text-darker hover:text-primary transition-colors"
            >
              音视频工具
            </Link>
            <Link href="/qrcode" className="text-darker hover:text-primary transition-colors">二维码工具</Link>
            <Link href="/regex" className="text-darker hover:text-primary transition-colors">正则表达式</Link>
            <Link href="/color" className="text-darker hover:text-primary transition-colors">颜色转换</Link>
            <Link href="/posts" className="text-darker hover:text-primary transition-colors">博客</Link>
            <Link href="/about" className="text-darker hover:text-primary transition-colors">关于</Link>
          </Space>
        </nav>
      </Header>

      <Content className="p-8">
        <div className="bg-white p-6 rounded-lg min-h-[80vh] shadow-md border border-[#d4b187]/20">
          {children}
        </div>
      </Content>

      <Footer className="text-center bg-[#557571] text-[#f7f4ed]">
        <div className="text-sm opacity-80">
          Copyright © {new Date().getFullYear()} ZLBG.CC All Rights Reserved.
        </div>
      </Footer>
    </Layout>
  );
}