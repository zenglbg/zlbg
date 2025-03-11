'use client';
import { Space, Input, Card, Select, Upload, message, Button } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import jsQR from 'jsqr';
import MainLayout from '@/components/layout/MainLayout';

const { TextArea } = Input;

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
            <Space direction="vertical" size="large" className="w-full">
                <Card title="生成二维码" className="border-secondary/20">
                    <Space direction="vertical" className="w-full">
                        <TextArea
                            rows={4}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="请输入要生成二维码的内容"
                            className="border-primary/20 hover:border-primary/40 focus:border-primary"
                        />
                        <Space>
                            <Select
                                value={size}
                                onChange={setSize}
                                options={[
                                    { label: '小', value: 128 },
                                    { label: '中', value: 256 },
                                    { label: '大', value: 512 },
                                ]}
                                style={{ width: 120 }}
                                className="border-primary/20"
                            />
                            <Select
                                value={level}
                                onChange={setLevel}
                                options={[
                                    { label: '低', value: 'L' },
                                    { label: '中', value: 'M' },
                                    { label: '高', value: 'Q' },
                                    { label: '最高', value: 'H' },
                                ]}
                                style={{ width: 120 }}
                                className="border-primary/20"
                            />
                        </Space>
                        <div className="flex justify-center p-4 bg-background/50 rounded-lg">
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

                <Card title="解析二维码" className="border-secondary/20">
                    <Space direction="vertical" className="w-full">
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
                                className="bg-primary text-background hover:bg-primary-light"
                            >
                                选择二维码图片
                            </Button>
                        </Upload>
                        {decodedText && (
                            <TextArea
                                rows={4}
                                value={decodedText}
                                readOnly
                                placeholder="解析结果将显示在这里"
                                className="border-primary/20"
                            />
                        )}
                    </Space>
                </Card>
            </Space>
        </MainLayout>
    );
}