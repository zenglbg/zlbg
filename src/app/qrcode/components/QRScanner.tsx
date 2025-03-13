'use client';
import { Space, Input, Card, Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import jsQR from 'jsqr';

const { TextArea } = Input;

export default function QRScanner() {
  const [decodedText, setDecodedText] = useState('');

  const decodeQR = async (file: File) => {
    try {
      const image = new Image();
      const imageUrl = URL.createObjectURL(file);

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        context?.drawImage(image, 0, 0);

        const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setDecodedText(code.data);
            message.success('二维码解析成功！');
          } else {
            message.error('未能识别二维码！');
          }
        }
        URL.revokeObjectURL(imageUrl);
      };

      image.src = imageUrl;
    } catch (error) {
      message.error('二维码解析失败！');
      console.error(error);
    }
  };

  return (
    <Card title="解析二维码" className="shadow-sm">
      <Space direction="vertical" className="w-full" size="large">
        <div className="flex justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed">
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              decodeQR(file);
              return false;
            }}
          >
            <Button 
              icon={<UploadOutlined />}
              size="large"
              type="primary"
            >
              选择二维码图片
            </Button>
          </Upload>
        </div>
        {decodedText && (
          <div>
            <div className="text-gray-500 mb-2">解析结果：</div>
            <TextArea
              rows={4}
              value={decodedText}
              readOnly
              className="font-mono"
            />
          </div>
        )}
      </Space>
    </Card>
  );
}