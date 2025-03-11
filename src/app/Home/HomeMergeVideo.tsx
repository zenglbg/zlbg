"use client";

import { useFFmpeg } from "@/contexts/FFmpegContext";
import { fetchFile } from "@ffmpeg/util";
import { Button, Upload, message, Progress, Card, List } from "antd";
import { UploadOutlined, DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function HomeMergeVideo() {
    const { ffmpeg } = useFFmpeg();
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [videoFiles, setVideoFiles] = useState<File[]>([]);

    const handleFileUpload = (file: File) => {
        setVideoFiles(prev => [...prev, file]);
        return false;
    };

    const removeFile = (index: number) => {
        setVideoFiles(prev => prev.filter((_, i) => i !== index));
    };

    const mergeVideos = async () => {
        if (!ffmpeg || videoFiles.length < 2) {
            if (videoFiles.length < 2) {
                message.warning("请至少上传两个视频文件进行合并");
            }
            return;
        }

        try {
            setProcessing(true);
            setProgress(0);
            setDownloadUrl('');

            ffmpeg.on('progress', ({ progress }) => {
                setProgress(Math.round(progress * 100));
            });

            // 创建一个文本文件，列出所有要合并的视频
            let fileContent = '';

            // 写入所有视频文件
            for (let i = 0; i < videoFiles.length; i++) {
                await ffmpeg.writeFile(`input${i}.mp4`, await fetchFile(videoFiles[i]));
                fileContent += `file 'input${i}.mp4'\n`;
                setProgress(30 * (i + 1) / videoFiles.length);
            }

            // 写入文件列表
            await ffmpeg.writeFile('filelist.txt', new TextEncoder().encode(fileContent));

            // 使用 concat demuxer 合并视频
            await ffmpeg.exec([
                '-f', 'concat',
                '-safe', '0',
                '-i', 'filelist.txt',
                '-c', 'copy',
                'output.mp4'
            ]);

            setProgress(80);
            const data = await ffmpeg.readFile("output.mp4") as any;
            const blobUrl = URL.createObjectURL(
                new Blob([data.buffer], { type: "video/mp4" })
            );

            setDownloadUrl(blobUrl);
            setProgress(100);
            message.success("视频合并完成！");
        } catch (error) {
            message.error("视频合并失败");
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
                <h2 className="text-xl font-bold">视频合并</h2>

                <div className="w-full">
                    <List
                        bordered
                        dataSource={videoFiles}
                        renderItem={(file, index) => (
                            <List.Item
                                actions={[
                                    <Button
                                        key="delete"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeFile(index)}
                                        disabled={processing}
                                    >
                                        删除
                                    </Button>
                                ]}
                            >
                                <div className="flex items-center">
                                    <span className="mr-2">{index + 1}.</span>
                                    <span className="truncate">{file.name}</span>
                                    <span className="ml-2 text-gray-500">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                                </div>
                            </List.Item>
                        )}
                        locale={{ emptyText: "请上传要合并的视频文件" }}
                    />
                </div>

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
                            添加视频
                        </Button>
                    </Upload>

                    <Button
                        type="primary"
                        size="large"
                        onClick={mergeVideos}
                        disabled={videoFiles.length < 2 || processing}
                    >
                        开始合并
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
                        download="merged_video.mp4"
                    >
                        下载合并后的视频
                    </Button>
                )}
            </div>
        </Card>
    );
}