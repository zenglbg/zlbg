'use client';
import { Space, Input, Card, Select, ColorPicker, Upload, Button, Tooltip, Form, Slider } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import { useState, useRef } from 'react';
import { UploadOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import type { Color } from 'antd/es/color-picker';

const { TextArea } = Input;

export default function QRGenerator() {
  const [text, setText] = useState('https://github.com');
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState('L');
  const [fgColor, setFgColor] = useState<string>('#557571');
  const [bgColor, setBgColor] = useState<string>('#f7f4ed');
  const [logo, setLogo] = useState<string>('');
  const [margin, setMargin] = useState(4);
  const [borderRadius, setBorderRadius] = useState(0); // 新增状态用于圆角控制
  const qrRef = useRef<HTMLCanvasElement>(null);

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogo(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleDownload = () => {
    const canvas = qrRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'qrcode.png';
      link.click();
    }
  };

  return (
    <Card 
      title="生成二维码" 
      className="shadow-sm"
      extra={
        <Button icon={<DownloadOutlined />} onClick={handleDownload}>
          下载二维码
        </Button>
      }
    >
      <div className="flex flex-col md:flex-row">
        <Form layout="vertical" className="flex-shrink-0 md:w-1/3 p-4">
          <Form.Item label="二维码内容">
            <TextArea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="请输入要生成二维码的内容"
              className="font-mono"
            />
          </Form.Item>
          <Form.Item label="尺寸">
            <Select
              value={size}
              onChange={setSize}
              options={[
                { label: '小尺寸', value: 128 },
                { label: '中等', value: 256 },
                { label: '大尺寸', value: 512 },
              ]}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item label="容错级别">
            <Select
              value={level}
              onChange={setLevel}
              options={[
                { label: '低容错', value: 'L' },
                { label: '中等', value: 'M' },
                { label: '较高', value: 'Q' },
                { label: '最高', value: 'H' },
              ]}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item label="前景色">
            <ColorPicker
              value={fgColor}
              onChange={(color: Color) => setFgColor(color.toHexString())}
              size="small"
            />
          </Form.Item>
          <Form.Item label="背景色">
            <ColorPicker
              value={bgColor}
              onChange={(color: Color) => setBgColor(color.toHexString())}
              size="small"
            />
          </Form.Item>
          <Form.Item label="边距">
            <Slider
              min={0}
              max={10}
              value={margin}
              onChange={setMargin}
            />
          </Form.Item>
          <Form.Item label="圆角">
            <Slider
              min={0}
              max={50}
              value={borderRadius}
              onChange={setBorderRadius}
            />
          </Form.Item>
        </Form>
        <div className="w-3"></div>
        <div className="flex-grow flex justify-center items-center p-4 bg-gray-50 rounded-lg" style={{ borderRadius: `${borderRadius}px` }}>
          <QRCodeCanvas
            ref={qrRef}
            value={text}
            size={size}
            level={level as 'L' | 'M' | 'Q' | 'H'}
            fgColor={fgColor}
            bgColor={bgColor}
            imageSettings={logo ? {
              src: logo,
              width: size * 0.2,
              height: size * 0.2,
              excavate: true,
            } : undefined}
          />
        </div>
      </div>
    </Card>
  );
}