"use client";

import { useFFmpeg } from "@/contexts/FFmpegContext";
import { fetchFile } from "@ffmpeg/util";
import { Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";

export default function HomeTranscode() {
    const { ffmpeg } = useFFmpeg();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const messageRef = useRef<HTMLParagraphElement | null>(null);
    const [processing, setProcessing] = useState(false);

    const transcode = async (file: File) => {
        if (!ffmpeg) return;
        try {
            setProcessing(true);
            await ffmpeg.writeFile("input.avi", await fetchFile(file));
            await ffmpeg.exec(["-i", "input.avi", "output.mp4"]);
            const data = (await ffmpeg.readFile("output.mp4")) as any;
            if (videoRef.current) {
                videoRef.current.src = URL.createObjectURL(
                    new Blob([data.buffer], { type: "video/mp4" })
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
            <Upload
                accept=".avi,.mp4,.mkv,.mov"
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
                    选择视频转换为 MP4
                </Button>
            </Upload>
            <p ref={messageRef} className="mt-4 text-gray-600"></p>
        </div>
    );
}