"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { useRef, useState } from "react";
import HomeTranscode from "./HomeTranscode";
import { Button } from "antd";
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
            <div className="w-64 bg-gray-800 text-white p-6">
                <h1 className="text-xl font-bold mb-6">音视频工具箱</h1>
                <nav className="space-y-4">
                    <button
                        onClick={() => setCurrentTool('transcode')}
                        className={`w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex items-center gap-2 ${currentTool === 'transcode' ? 'bg-gray-700' : ''
                            }`}
                    >
                        <VideoCameraOutlined /> 视频转换
                    </button>
                    <button
                        onClick={() => setCurrentTool('compress')}
                        className={`w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex items-center gap-2 ${currentTool === 'compress' ? 'bg-gray-700' : ''
                            }`}
                    >
                        <CompressOutlined /> 视频压缩
                    </button>
                    <button
                        onClick={() => setCurrentTool('extract')}
                        className={`w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex items-center gap-2 ${currentTool === 'extract' ? 'bg-gray-700' : ''
                            }`}
                    >
                        <AudioOutlined /> 提取音频
                    </button>
                </nav>
            </div>

            {/* 主要内容区域 */}
            <LoadFFmpeg>
                {renderContent()}
            </LoadFFmpeg>
        </div>
    );
}
