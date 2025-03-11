"use client";

import { useFFmpeg } from "@/contexts/FFmpegContext";
import { fetchFile } from "@ffmpeg/util";
import { Button, Upload, message, Select, Form, Progress } from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";

const VIDEO_FORMATS = [
    { label: 'MP4', value: 'mp4' },
    { label: 'AVI', value: 'avi' },
    { label: 'MKV', value: 'mkv' },
    { label: 'MOV', value: 'mov' },
    { label: 'WebM', value: 'webm' },
];

export default function HomeTranscode() {
    const { ffmpeg } = useFFmpeg();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [processing, setProcessing] = useState(false);
    const [targetFormat, setTargetFormat] = useState('mp4');
    const [progress, setProgress] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    
    const transcode = async (file: File) => {
        if (!ffmpeg) return;
        try {
            setProcessing(true);
            setProgress(0);
            setDownloadUrl(''); // 重置下载链接
            const inputFileName = `input.${file.name.split('.').pop()}`;
            const outputFileName = `output.${targetFormat}`;

            // 监听处理进度
            ffmpeg.on('progress', ({ progress }) => {
                setProgress(Math.round(progress * 100));
            });

            await ffmpeg.writeFile(inputFileName, await fetchFile(file));
            setProgress(20); // 文件写入完成

            await ffmpeg.exec(["-i", inputFileName, outputFileName]);
            setProgress(80); // 转换完成

            const data = (await ffmpeg.readFile(outputFileName)) as any;
            const blobUrl = URL.createObjectURL(
                new Blob([data.buffer], { type: `video/${targetFormat}` })
            );
            if (videoRef.current) {
                videoRef.current.src = blobUrl;
            }
            setDownloadUrl(blobUrl);
            setProgress(100);
            message.success("转换完成！");
        } catch (error) {
            message.error("转换失败");
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
        <div className="flex flex-col items-center justify-center h-full">
            <video ref={videoRef} controls className="max-w-2xl mb-6"></video>
            <Form layout="inline" className="mb-4">
                <Form.Item label="目标格式">
                    <Select
                        value={targetFormat}
                        onChange={setTargetFormat}
                        options={VIDEO_FORMATS}
                        style={{ width: 120 }}
                    />
                </Form.Item>
                <Form.Item>
                    <Upload
                        accept={VIDEO_FORMATS.map(f => `.${f.value}`).join(',')}
                        showUploadList={false}
                        beforeUpload={(file) => {
                            transcode(file);
                            return false;
                        }}
                    >
                        <Button
                            type="primary"
                            icon={<UploadOutlined />}
                            loading={processing}
                            size="large"
                        >
                            选择视频转换为 {targetFormat.toUpperCase()}
                        </Button>
                    </Upload>
                </Form.Item>
            </Form>
            {processing && (
                <div className="w-96 mt-4">
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
                    href={downloadUrl}
                    download={`converted.${targetFormat}`}
                    className="mt-4"
                    icon={<DownloadOutlined />}
                >
                    下载转换后的视频
                </Button>
            )}
        </div>
    );
}