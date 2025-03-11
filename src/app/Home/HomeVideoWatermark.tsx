"use client";

import { useFFmpeg } from "@/contexts/FFmpegContext";
import { fetchFile } from "@ffmpeg/util";
import { Button, Upload, message, Progress, Card, Input, Select, Form, Slider, ColorPicker } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";

export default function HomeVideoWatermark() {
    const { ffmpeg } = useFFmpeg();
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [videoSrc, setVideoSrc] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [form] = Form.useForm();
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const handleFileUpload = (file: File) => {
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoSrc(url);
        setDownloadUrl('');
        return false;
    };

    const addWatermark = async () => {
        if (!ffmpeg || !videoFile) {
            message.warning("请先上传视频");
            return;
        }

        try {
            setProcessing(true);
            setProgress(0);
            setDownloadUrl('');

            ffmpeg.on('progress', ({ progress }) => {
                setProgress(Math.round(progress * 100));
            });

            const values = await form.validateFields();

            // 写入视频文件
            await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));
            setProgress(20);

            let ffmpegCommand = [
                "-i", "input.mp4"
            ];

            // 根据水印类型添加不同的命令
            if (values.watermarkType === 'text') {
                // 文字水印
                const fontColor = values.textColor.toHexString().replace('#', '');
                const fontSize = values.textSize;
                const position = values.position;

                let positionString = '';
                switch (position) {
                    case 'topLeft': positionString = "10:10"; break;
                    case 'topRight': positionString = "W-tw-10:10"; break;
                    case 'bottomLeft': positionString = "10:H-th-10"; break;
                    case 'bottomRight': positionString = "W-tw-10:H-th-10"; break;
                    case 'center': positionString = "(W-tw)/2:(H-th)/2"; break;
                }

                ffmpegCommand = [
                    ...ffmpegCommand,
                    "-vf", `drawtext=text='${values.text}':fontcolor=${fontColor}:fontsize=${fontSize}:x=${positionString.split(':')[0]}:y=${positionString.split(':')[1]}:alpha=${values.opacity}`
                ];
            } else {
                // 图片水印 - 这里需要先上传图片
                message.info("图片水印功能暂未实现，请使用文字水印");
                setProcessing(false);
                return;
            }

            // 完成命令
            ffmpegCommand = [
                ...ffmpegCommand,
                "-c:a", "copy",
                "output.mp4"
            ];

            // 执行命令
            await ffmpeg.exec(ffmpegCommand);

            setProgress(80);
            const data = await ffmpeg.readFile("output.mp4") as any;
            const blobUrl = URL.createObjectURL(
                new Blob([data.buffer], { type: "video/mp4" })
            );

            setDownloadUrl(blobUrl);
            setProgress(100);
            message.success("视频水印添加完成！");
        } catch (error) {
            message.error("视频水印添加失败");
            console.error(error);
        } finally {
            setProcessing(false);
            // 清除进度监听
            ffmpeg.off('progress', function (params) {
                console.log("🚀 ~ params:", params)
            });
        }
    };

    return (
        <Card className="w-full mx-auto shadow-lg">
            <div className="flex flex-col items-center space-y-6 p-4">
                {videoSrc && (
                    <video
                        ref={videoRef}
                        controls
                        className="h-80 max-h-[400px] mb-4"
                        src={videoSrc}
                    ></video>
                )}

                <Form
                    form={form}
                    layout="vertical"
                    className="w-full"
                    initialValues={{
                        watermarkType: 'text',
                        text: '视频水印',
                        textSize: 24,
                        textColor: '#ffffff',
                        position: 'bottomRight',
                        opacity: 0.8
                    }}
                >
                    <Form.Item
                        label="水印类型"
                        name="watermarkType"
                    >
                        <Select
                            options={[
                                { label: '文字水印', value: 'text' },
                                { label: '图片水印', value: 'image', disabled: true }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="水印文字"
                        name="text"
                        rules={[{ required: true, message: '请输入水印文字' }]}
                    >
                        <Input placeholder="请输入水印文字" />
                    </Form.Item>

                    <Form.Item
                        label="文字大小"
                        name="textSize"
                    >
                        <Slider min={12} max={72} />
                    </Form.Item>

                    <Form.Item
                        label="文字颜色"
                        name="textColor"
                    >
                        <ColorPicker />
                    </Form.Item>

                    <Form.Item
                        label="水印位置"
                        name="position"
                    >
                        <Select
                            options={[
                                { label: '左上角', value: 'topLeft' },
                                { label: '右上角', value: 'topRight' },
                                { label: '左下角', value: 'bottomLeft' },
                                { label: '右下角', value: 'bottomRight' },
                                { label: '居中', value: 'center' }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="透明度"
                        name="opacity"
                    >
                        <Slider min={0.1} max={1} step={0.1} />
                    </Form.Item>
                </Form>

                <div className="flex space-x-4">
                    <Upload
                        accept="video/*"
                        beforeUpload={handleFileUpload}
                        showUploadList={false}
                    >
                        <Button
                            type="primary"
                            size="large"
                            icon={<UploadOutlined />}
                            loading={processing}
                        >
                            选择视频
                        </Button>
                    </Upload>

                    <Button
                        type="primary"
                        size="large"
                        onClick={addWatermark}
                        disabled={!videoSrc || processing}
                    >
                        添加水印
                    </Button>
                </div>

                {processing && (
                    <div className="w-full">
                        <Progress
                            percent={progress}
                            status={progress === 100 ? "success" : "active"}
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                        />
                    </div>
                )}

                {downloadUrl && (
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        href={downloadUrl}
                        download="watermarked_video.mp4"
                    >
                        下载添加水印后的视频
                    </Button>
                )}
            </div>
        </Card>
    );
}