"use client";

import { useFFmpeg } from "@/contexts/FFmpegContext";
import { fetchFile } from "@ffmpeg/util";
import { Button, Upload, message, Select, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
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

    const transcode = async (file: File) => {
        if (!ffmpeg) return;
        try {
            setProcessing(true);
            const inputFileName = `input.${file.name.split('.').pop()}`;
            const outputFileName = `output.${targetFormat}`;

            await ffmpeg.writeFile(inputFileName, await fetchFile(file));
            await ffmpeg.exec(["-i", inputFileName, outputFileName]);
            const data = (await ffmpeg.readFile(outputFileName)) as any;
            
            if (videoRef.current) {
                videoRef.current.src = URL.createObjectURL(
                    new Blob([data.buffer], { type: `video/${targetFormat}` })
                );
            }
            message.success("转换完成！");
        } catch (error) {
            message.error("转换失败");
            console.error(error);
        } finally {
            setProcessing(false);
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
        </div>
    );
}