"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { useRef, useState } from "react";
import HomeTranscode from "./HomeTranscode";
import { Button } from "antd";
import LoadFFmpeg from "./LoadFFmpeg";
import HomeCompress from "./HomeCompress";
import HomeExtractAudio from "./HomeExtractAudio";
 
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
                    <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-700">
                        视频转换
                    </button>
                    <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-700">
                        视频压缩
                    </button>
                    <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-700">
                        提取音频
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
