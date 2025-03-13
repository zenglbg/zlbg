'use client';
import { Space, Input, Card, Select, Upload, message, Button, Typography } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import jsQR from 'jsqr';
import MainLayout from '@/components/layout/MainLayout';

const { TextArea } = Input;
const { Title } = Typography;

export default function QRCode() {
    const [text, setText] = useState('https://github.com');
    const [size, setSize] = useState(256);
    const [level, setLevel] = useState('L');
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
        <MainLayout>
            <div className="max-w-6xl mx-auto">
                <Space direction="vertical" size="large" className="w-full">
                    <Title level={4}>二维码工具</Title>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
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
                        </div>

                        <div className="space-y-6">
                            <Card 
                                title="解析二维码" 
                                className="shadow-sm"
                            >
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
                        </div>
                    </div>
                </Space>
            </div>
        </MainLayout>
    );
}