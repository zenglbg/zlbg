'use client';
import { Form, Select, ColorPicker, Slider } from 'antd';
import { useState } from 'react';
import type { Color } from 'antd/es/color-picker';

export default function QRStyleSelector({ onStyleChange }: { onStyleChange: (style: { size: number; level: string; fgColor: string; bgColor: string; borderRadius: number }) => void }) {
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState('L');
  const [fgColor, setFgColor] = useState<string>('#557571');
  const [bgColor, setBgColor] = useState<string>('#f7f4ed');
  const [borderRadius, setBorderRadius] = useState(0);

  const handleStyleChange = () => {
    onStyleChange({ size, level, fgColor, bgColor, borderRadius });
  };

  return (
    <Form layout="vertical" className="p-4" onChange={handleStyleChange}>
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
      <Form.Item label="圆角">
        <Slider
          min={0}
          max={50}
          value={borderRadius}
          onChange={setBorderRadius}
        />
      </Form.Item>
    </Form>
  );
}