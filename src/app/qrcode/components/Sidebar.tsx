'use client';
import { Menu } from 'antd';
import { QrcodeOutlined, ScanOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    {
      key: '/qrcode/generate',
      icon: <QrcodeOutlined />,
      label: '生成二维码',
    },
    {
      key: '/qrcode/scan',
      icon: <ScanOutlined />,
      label: '解析二维码',
    },
  ];

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      items={items}
      onClick={({ key }) => router.push(key)}
      className="h-full border-r-0"
    />
  );
}