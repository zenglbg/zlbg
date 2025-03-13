'use client';
import { Space, Typography, Steps } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import Sidebar from '../components/Sidebar';
import QRBatchGenerator from '../components/QRBatchGenerator';
import { useState } from 'react';
import QRStyleSelector from '../components/QRStyleSelector';

const { Title } = Typography;
const { Step } = Steps;

export default function BatchPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [style, setStyle] = useState({});

  const steps = [
    {
      title: '选择二维码样式',
      content: <QRStyleSelector onStyleChange={setStyle} />, // 使用样式选择组件
    },
    {
      title: '编辑数据',
      content: <QRBatchGenerator qrStyle={style} />, // 将样式传递给批量生成组件
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <Space direction="vertical" size="large" className="w-full">
          <Title level={4}>批量生成二维码</Title>
          
          <div className="flex">
            <div className="w-48 flex-shrink-0">
              <Sidebar />
            </div>
            
            <div className="flex-grow ml-6">
              <Steps current={currentStep} onChange={setCurrentStep}>
                {steps.map((step, index) => (
                  <Step key={index} title={step.title} />
                ))}
              </Steps>
              <div className="mt-6">
                {steps[currentStep].content}
              </div>
            </div>
          </div>
        </Space>
      </div>
    </MainLayout>
  );
}