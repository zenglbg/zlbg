"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { useRef, useState } from "react";
import HomeTranscode from "./HomeTranscode";
import { Button, Card } from "antd";
import LoadFFmpeg from "./LoadFFmpeg";
import HomeCompress from "./HomeCompress";
import HomeExtractAudio from "./HomeExtractAudio";
import { VideoCameraOutlined, CompressOutlined, AudioOutlined } from "@ant-design/icons";
import { PictureOutlined } from "@ant-design/icons";
import HomeImageCompress from "./HomeImageCompress";
import HomeMixAudio from "./HomeMixAudio";

export default function Home() {
    const [currentTool, setCurrentTool] = useState<'transcode' | 'compress' | "mixAudio" | 'extract' | 'image'>('transcode');

    const renderContent = () => {
        switch (currentTool) {
            case 'transcode':
                return <HomeTranscode />;
            case 'compress':
                return <HomeCompress />;
            case 'extract':
                return <HomeExtractAudio />;
            case 'mixAudio':
                return <HomeMixAudio />;
            case 'image':
                return <HomeImageCompress />;
        }
        return <div className=""></div>
    };

    const renderNavButton = (
        tool: typeof currentTool,
        icon: React.ReactNode,
        label: string
    ) => (
        <button
            onClick={() => setCurrentTool(tool)}
            className={`w-full text-left py-2 px-4 rounded transition-colors duration-200 flex items-center gap-2 ${currentTool === tool
                ? 'bg-blue-200 text-white'
                : 'text-gray-300 hover:bg-blue-200/20 hover:text-white'
                }`}
        >
            {icon} {label}
        </button>
    );

    return (
        <div className="flex h-screen">
            <Card
                title="音视频工具箱"
                variant="borderless"
                className="w-64 h-full text-white"
            >
                <nav className="space-y-4">
                    {renderNavButton('transcode', <VideoCameraOutlined />, '视频转换')}
                    {renderNavButton('compress', <CompressOutlined />, '视频压缩')}
                    {renderNavButton('extract', <AudioOutlined />, '提取音频')}
                    {renderNavButton('mixAudio', <AudioOutlined />, '音频混音')}
                    {renderNavButton('image', <PictureOutlined />, '图片压缩')}
                </nav>
            </Card>

            {/* 主要内容区域 */}
            <LoadFFmpeg>
                {renderContent()}
            </LoadFFmpeg>
        </div>
    );
}
