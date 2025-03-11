'use client';
import MainLayout from '@/components/layout/MainLayout';
import { Layout, Typography, Space, Input, Button, Card, message } from 'antd';
import { useState } from 'react';

const { Header, Content } = Layout;
const { Title } = Typography;
 
export default function ColorConverter() {
  const [hex, setHex] = useState('#000000');
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
  const [hsl, setHsl] = useState({ h: 0, s: 0, l: 0 });

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      setRgb({ r, g, b });
      rgbToHsl(r, g, b);
    } else {
      message.error('无效的HEX颜色值');
    }
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    setHsl({
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    });
  };

  // 添加新的转换函数
  const rgbToHex = () => {
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    const newHex = `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
    setHex(newHex);
    hexToRgb(newHex);
  };

  const hslToRgb = () => {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const newRgb = {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
    setRgb(newRgb);
    rgbToHex();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('已复制到剪贴板');
    });
  };

  return (
    <MainLayout>
      <Space direction="vertical" size="large" className="w-full">
        <Title level={4} className="mb-6">颜色转换工具</Title>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="颜色预览" className="w-full">
            <div 
              className="w-full h-32 rounded-lg border"
              style={{ backgroundColor: hex }}
            />
          </Card>

          <Card className="w-full">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <span className="font-bold w-20">HEX:</span>
                <Input 
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 mx-2"
                />
                <Button onClick={() => hexToRgb(hex)} type="primary" size="small">
                  转换
                </Button>
                <Button 
                  onClick={() => copyToClipboard(hex)}
                  size="small"
                  className="ml-2"
                >
                  复制
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold w-20">RGB:</span>
                <Space.Compact className="flex-1 mx-2">
                  <Input
                    value={rgb.r}
                    onChange={(e) => {
                      const newRgb = { ...rgb, r: Math.min(255, Math.max(0, Number(e.target.value) || 0)) };
                      setRgb(newRgb);
                      rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
                      rgbToHex();
                    }}
                    className="w-20"
                    type="number"
                    min={0}
                    max={255}
                  />
                  <Input
                    value={rgb.g}
                    onChange={(e) => {
                      const newRgb = { ...rgb, g: Math.min(255, Math.max(0, Number(e.target.value) || 0)) };
                      setRgb(newRgb);
                      rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
                      rgbToHex();
                    }}
                    className="w-20"
                    type="number"
                    min={0}
                    max={255}
                  />
                  <Input
                    value={rgb.b}
                    onChange={(e) => {
                      const newRgb = { ...rgb, b: Math.min(255, Math.max(0, Number(e.target.value) || 0)) };
                      setRgb(newRgb);
                      rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
                      rgbToHex();
                    }}
                    className="w-20"
                    type="number"
                    min={0}
                    max={255}
                  />
                </Space.Compact>
                <Button onClick={rgbToHex} type="primary" size="small">
                  转换
                </Button>
                <Button 
                  onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                  size="small"
                  className="ml-2"
                >
                  复制
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold w-20">HSL:</span>
                <Space.Compact className="flex-1 mx-2">
                  <Input
                    value={hsl.h}
                    onChange={(e) => {
                      const newHsl = { ...hsl, h: Math.min(360, Math.max(0, Number(e.target.value) || 0)) };
                      setHsl(newHsl);
                      hslToRgb();
                    }}
                    className="w-20"
                    type="number"
                    min={0}
                    max={360}
                  />
                  <Input
                    value={hsl.s}
                    onChange={(e) => {
                      const newHsl = { ...hsl, s: Math.min(100, Math.max(0, Number(e.target.value) || 0)) };
                      setHsl(newHsl);
                      hslToRgb();
                    }}
                    className="w-20"
                    type="number"
                    min={0}
                    max={100}
                  />
                  <Input
                    value={hsl.l}
                    onChange={(e) => {
                      const newHsl = { ...hsl, l: Math.min(100, Math.max(0, Number(e.target.value) || 0)) };
                      setHsl(newHsl);
                      hslToRgb();
                    }}
                    className="w-20"
                    type="number"
                    min={0}
                    max={100}
                  />
                </Space.Compact>
                <Button onClick={hslToRgb} type="primary" size="small">
                  转换
                </Button>
                <Button 
                  onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                  size="small"
                  className="ml-2"
                >
                  复制
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Space>
    </MainLayout>
  );
}