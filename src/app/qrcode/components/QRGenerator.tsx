'use client';
import { Space, Input, Card, Select } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';

const { TextArea } = Input;

export default function QRGenerator() {
  const [text, setText] = useState('https://github.com');
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState('L');

  return (
    <Card 
      title="生成二维码" 
      className="shadow-sm"
      extra={
        <Space>
          <Select
            value={size}
            onChange={setSize}
            options={[
              { label: '小尺寸', value: 128 },
              { label: '中等', value: 256 },
              { label: '大尺寸', value: 512 },
            ]}
            style={{ width: 100 }}
          />
          <Select
            value={level}
            onChange={setLevel}
            options={[
              { label: '低容错', value: 'L' },
              { label: '中等', value: 'M' },
              { label: '较高', value: 'Q' },
              { label: '最高', value: 'H' },
            ]}
            style={{ width: 100 }}
          />
        </Space>
      }
    >
      <Space direction="vertical" className="w-full">
        <TextArea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="请输入要生成二维码的内容"
          className="font-mono"
        />
        <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
          <QRCodeCanvas
            value={text}
            size={size}
            level={level as 'L' | 'M' | 'Q' | 'H'}
            includeMargin
            fgColor="#557571"
            bgColor="#f7f4ed"
          />
        </div>
      </Space>
    </Card>
  );
}