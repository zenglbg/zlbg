"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { useRef, useState } from "react";
import HomeTranscode from "./HomeTranscode";
import { Button, Card } from "antd";
import LoadFFmpeg from "./LoadFFmpeg";
import HomeCompress from "./HomeCompress";
import HomeExtractAudio from "./HomeExtractAudio";
import { VideoCameraOutlined, CompressOutlined, AudioOutlined } from "@ant-design/icons";

export default function Home() {
    const [currentTool, setCurrentTool] = useState<'transcode' | 'compress' | 'extract'>('transcode');
    const renderContent = () => {
        switch (currentTool) {
            case 'transcode':
                return <HomeTranscode />;
            case 'compress':
                return <HomeCompress />;
            case 'extract':
                return <HomeExtractAudio />;
        }
        return <div className=""></div>
    };
    return (
        <div className="flex h-screen">
            {/* 侧边栏 */}
            <Card
                title="音视频工具箱"
                variant="borderless"
                className="w-64 h-full text-white"
            >
                <nav className="space-y-4">
                    <button
                        onClick={() => setCurrentTool('transcode')}
                        className={`w-full text-left py-2 px-4 rounded hover:bg-gray-200 flex items-center gap-2`}
                    >
                        <VideoCameraOutlined /> 视频转换
                    </button>
                    <button
                        onClick={() => setCurrentTool('compress')}
                        className={`w-full text-left py-2 px-4 rounded hover:bg-gray-200 flex items-center gap-2`}
                    >
                        <CompressOutlined /> 视频压缩
                    </button>
                    <button
                        onClick={() => setCurrentTool('extract')}
                        className={`w-full text-left py-2 px-4 rounded hover:bg-gray-200 flex items-center gap-2`}
                    >
                        <AudioOutlined /> 提取音频
                    </button>
                </nav>
            </Card>


            {/* 主要内容区域 */}
            <LoadFFmpeg>
                {renderContent()}
            </LoadFFmpeg>
        </div>
    );
}
