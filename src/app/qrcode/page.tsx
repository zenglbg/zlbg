'use client';
import { Space, Typography } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import Sidebar from './components/Sidebar';
import QRGenerator from './components/QRGenerator';
import QRScanner from './components/QRScanner';

const { Title } = Typography;

export default function QRCode() {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <Space direction="vertical" size="large" className="w-full">
          <Title level={4}>二维码工具</Title>
          
          <div className="flex">
            <div className="w-48 flex-shrink-0">
              <Sidebar />
            </div>
            
            <div className="flex-grow ml-6">
              <div className="grid grid-cols-1 gap-6">
                <QRGenerator />
                <QRScanner />
              </div>
            </div>
          </div>
        </Space>
      </div>
    </MainLayout>
  );
}