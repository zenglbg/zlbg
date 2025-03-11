"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useRef, useState } from "react";
import HomeTranscode from "./HomeTranscode";
import { Button } from "antd";
import LoadFFmpeg from "./LoadFFmpeg";

export default function Home() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const messageRef = useRef<HTMLParagraphElement | null>(null);

    const load = async () => {
        setIsLoading(true);
        // const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
        const baseURL = "/ffmpeg";
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on("log", ({ message }) => {
            if (messageRef.current) messageRef.current.innerHTML = message;
        });
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
            wasmURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.wasm`,
                "application/wasm"
            ),
        });
        setLoaded(true);
        setIsLoading(false);
    };

    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
        // u can use 'https://ffmpegwasm.netlify.app/video/video-15s.avi' to download the video to public folder for testing
        await ffmpeg.writeFile(
            "input.avi",
            await fetchFile(
                "https://raw.githubusercontent.com/ffmpegwasm/testdata/master/video-15s.avi"
            )
        );
        await ffmpeg.exec(["-i", "input.avi", "output.mp4"]);
        const data = (await ffmpeg.readFile("output.mp4")) as any;
        if (videoRef.current)
            videoRef.current.src = URL.createObjectURL(
                new Blob([data.buffer], { type: "video/mp4" })
            );
    };

    return (
        <div className="flex h-screen">
            {/* 侧边栏 */}
            <div className="w-64 bg-gray-800 text-white p-6">
                <h1 className="text-xl font-bold mb-6">FFmpeg 工具箱</h1>
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
                <HomeTranscode ffmpeg={ffmpegRef.current} />
            </LoadFFmpeg>
        </div>
    );
}
