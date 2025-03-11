"use client";

import { useFFmpeg } from "@/contexts/FFmpegContext";
import { fetchFile } from "@ffmpeg/util";
import { Button, Upload, message, Progress, Card, Slider } from "antd";
import { UploadOutlined, DownloadOutlined, ScissorOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";

export default function HomeVideoEdit() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const { ffmpeg } = useFFmpeg();
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoSrc, setVideoSrc] = useState<string>('');
    const [duration, setDuration] = useState(0);
    const [trimRange, setTrimRange] = useState<[number, number]>([0, 100]);

    const handleVideoLoad = () => {
        if (videoRef.current) {
            const videoDuration = videoRef.current.duration;
            setDuration(videoDuration);
            setTrimRange([0, videoDuration]);
        }
    };

    const handleFileUpload = (file: File) => {
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoSrc(url);
        setDownloadUrl('');
        return false;
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const trimVideo = async () => {
        if (!ffmpeg || !videoFile) return;
        try {
            setProcessing(true);
            setProgress(0);
            setDownloadUrl('');

            ffmpeg.on('progress', ({ progress }) => {
                setProgress(Math.round(progress * 100));
            });

            const startTime = trimRange[0];
            const endTime = trimRange[1];
            const duration = endTime - startTime;

            await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));
            setProgress(20);

            await ffmpeg.exec([
                "-i", "input.mp4",
                "-ss", startTime.toString(),
                "-t", duration.toString(),
                "-c:v", "copy",
                "-c:a", "copy",
                "output.mp4"
            ]);

            setProgress(80);
            const data = await ffmpeg.readFile("output.mp4") as any;
            const blobUrl = URL.createObjectURL(
                new Blob([data.buffer], { type: "video/mp4" })
            );

            if (videoRef.current) {
                videoRef.current.src = blobUrl;
            }
            setDownloadUrl(blobUrl);
            setProgress(100);
            message.success("视频剪辑完成！");
        } catch (error) {
            message.error("视频剪辑失败");
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
                <video
                    ref={videoRef}
                    controls
                    className="h-100 mb-6"
                    src={videoSrc}
                    onLoadedMetadata={handleVideoLoad}
                ></video>

                {videoSrc && duration > 0 && (
                    <div className="w-full mb-4">
                        <p className="mb-2">选择剪辑范围：</p>
                        <div className="flex justify-between mb-1">
                            <span>{formatTime(trimRange[0])}</span>
                            <span>{formatTime(trimRange[1])}</span>
                        </div>
                        <Slider
                            range
                            min={0}
                            max={duration}
                            value={trimRange}
                            onChange={(value) => setTrimRange(value as [number, number])}
                            disabled={processing}
                        />
                    </div>
                )}

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

                    {videoSrc && (
                        <Button
                            type="primary"
                            size="large"
                            icon={<ScissorOutlined />}
                            onClick={trimVideo}
                            disabled={processing}
                        >
                            剪辑视频
                        </Button>
                    )}
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
                        download="trimmed_video.mp4"
                    >
                        下载剪辑后的视频
                    </Button>
                )}
            </div>
        </Card>
    );
}