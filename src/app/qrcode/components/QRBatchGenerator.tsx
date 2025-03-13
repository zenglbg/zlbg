'use client';
import { Space, Input, Card, Button, Form, Table, Upload, message } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export default function QRBatchGenerator({ qrStyle }: { qrStyle: { size?: number; level?: string; fgColor?: string; bgColor?: string; } }) {
  const [texts, setTexts] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleGenerate = () => {
    const newTexts = inputValue.split('\n').filter(text => text.trim() !== '');
    setTexts(newTexts);
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newTexts = content.split('\n').filter(text => text.trim() !== '');
      setTexts(newTexts);
      message.success('文件上传成功！');
    };
    reader.readAsText(file);
    return false;
  };

  const handleDownloadSample = () => {
    const sampleData = '示例二维码内容1\n示例二维码内容2\n示例二维码内容3';
    const blob = new Blob([sampleData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sample_qr_codes.txt';
    link.click();
  };

  const columns = [
    {
      title: '二维码',
      dataIndex: 'qrCode',
      key: 'qrCode',
      render: (text: string) => (
        <QRCodeCanvas
          value={text}
          size={qrStyle.size || 128}
          level={qrStyle.level as 'L' | 'M' | 'Q' | 'H'}
          includeMargin
          fgColor={qrStyle.fgColor || '#557571'}
          bgColor={qrStyle.bgColor || '#f7f4ed'}
        />
      ),
    },
    {
      title: '内容',
      dataIndex: 'text',
      key: 'text',
    },
  ];

  const dataSource = texts.map((text, index) => ({
    key: index,
    qrCode: text,
    text: text,
  }));

  return (
    <Card title="批量生成二维码" className="shadow-sm">
      <Form layout="vertical" className="p-4">
        <Form.Item label="输入多个内容，每行一个">
          <TextArea
            rows={6}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="请输入要生成二维码的内容，每行一个"
            className="font-mono"
          />
        </Form.Item>
        <Button type="primary" onClick={handleGenerate}>
          生成二维码
        </Button>
        <Upload accept=".txt" showUploadList={false} beforeUpload={handleUpload}>
          <Button icon={<UploadOutlined />} className="ml-2">
            上传二维码数据
          </Button>
        </Upload>
        <Button icon={<DownloadOutlined />} onClick={handleDownloadSample} className="ml-2">
          下载示例表格
        </Button>
      </Form>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </Card>
  );
}