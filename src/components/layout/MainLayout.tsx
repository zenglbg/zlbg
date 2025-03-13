'use client'
import Link from "next/link";
import Image from "next/image";
import { Layout, Space, Typography, Select } from 'antd';
import { useState } from 'react';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { Option } = Select;

const trackEvent = (action: string, category: string, label: string) => {
  // @ts-ignore
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
  })
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('zh');

  return (
    <Layout className="min-h-screen bg-[#f7f4ed]">
      <Header className="flex items-center justify-between px-6" style={{ backgroundColor: '#557571' }}>
        <div className="flex items-center">
          <Title level={4} style={{ margin: 0, color: '#f7f4ed', marginRight: '2rem' }}>ZLBG.CC</Title>
          <nav>
            <Space size="middle">
              <Link
                href="/"
                onClick={() => trackEvent('click', 'navigation', 'home')}
                className="text-[#f7f4ed] hover:text-[#d4b187] transition-colors"
              >
                音视频工具
              </Link>
              <Link href="/qrcode" className="text-[#f7f4ed] hover:text-[#d4b187] transition-colors">二维码工具</Link>
              <Link href="/regex" className="text-[#f7f4ed] hover:text-[#d4b187] transition-colors">正则表达式</Link>
              <Link href="/color" className="text-[#f7f4ed] hover:text-[#d4b187] transition-colors">颜色转换</Link>
              <Link href="/posts" className="text-[#f7f4ed] hover:text-[#d4b187] transition-colors">博客</Link>
              <Link href="/about" className="text-[#f7f4ed] hover:text-[#d4b187] transition-colors">关于</Link>
            </Space>
          </nav>
        </div>
        
        <Select
          value={language}
          onChange={(value) => {
            setLanguage(value);
            trackEvent('change', 'language', value);
          }}
          style={{ width: 100 }}
          dropdownStyle={{ backgroundColor: '#f7f4ed' }}
        >
          <Option value="zh">中文</Option>
          <Option value="en">English</Option>
        </Select>
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