"use client";

import { useFFmpeg } from "@/contexts/FFmpegContext";
import { fetchFile } from "@ffmpeg/util";
import { Button, Upload, message, Progress, Card } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";

export default function HomeMixAudio() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { ffmpeg } = useFFmpeg();
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState<string>('');

    const mixAudio = async (file1: File, file2: File) => {
        if (!ffmpeg) return;
        try {
            setProcessing(true);
            setProgress(0);
            setDownloadUrl('');

            ffmpeg.on('progress', ({ progress }) => {
                setProgress(Math.round(progress * 100));
            });

            await ffmpeg.writeFile("input1.mp3", await fetchFile(file1));
            await ffmpeg.writeFile("input2.mp3", await fetchFile(file2));
            setProgress(20);

            await ffmpeg.exec([
                "-i", "input1.mp3",
                "-i", "input2.mp3",
                "-filter_complex", "[0:a][1:a]amix=inputs=2:duration=longest",
                "output.mp3"
            ]);

            setProgress(80);
            const data = await ffmpeg.readFile("output.mp3") as any;
            const blobUrl = URL.createObjectURL(
                new Blob([data.buffer], { type: "audio/mp3" })
            );

            if (audioRef.current) {
                audioRef.current.src = blobUrl;
            }
            setDownloadUrl(blobUrl);
            setProgress(100);
            message.success("音频混音完成！");
        } catch (error) {
            message.error("音频混音失败");
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
                <audio ref={audioRef} controls className="w-full mb-6"></audio>

                {/* 添加提示信息 */}
                <div className="text-center text-gray-500">
                    请上传两个音频文件进行混音
                </div>

                <Upload
                    accept="audio/*"
                    beforeUpload={(file) => {
                        // 这里需要选择两个音频文件进行混音
                        // 可以使用状态管理选择文件
                        return false;
                    }}
                    showUploadList={false}
                >
                    <Button
                        type="primary"
                        size="large"
                        icon={<UploadOutlined />}
                        loading={processing}
                    >
                        选择音频文件进行混音
                    </Button>
                </Upload>

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
                        download="mixed_audio.mp3"
                    >
                        下载混音后的音频
                    </Button>
                )}
            </div>
        </Card>
    );
}