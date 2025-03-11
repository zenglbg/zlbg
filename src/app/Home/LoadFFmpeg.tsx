"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { cloneElement, ReactElement, useState } from "react";
import { Button, Card, message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useFFmpeg } from "@/contexts/FFmpegContext";

interface Props {
    children: ReactElement;
    onFFmpegLoaded?: (ffmpeg: FFmpeg) => void;
}

export default function LoadFFmpeg({ children, onFFmpegLoaded }: Props) {

    const { load, loaded, loading } = useFFmpeg()
    // const [ffmpeg] = useState(() => new FFmpeg());

    // const load = async () => {
    //     try {
    //         setIsLoading(true);
    //         const baseURL = "/ffmpeg";

    //         ffmpeg.on("log", ({ message: msg }) => {
    //             message.info(msg);
    //         });

    //         await ffmpeg.load({
    //             coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    //             wasmURL: await toBlobURL(
    //                 `${baseURL}/ffmpeg-core.wasm`,
    //                 "application/wasm"
    //             ),
    //         });

    //         setLoaded(true);
    //         message.success("FFmpeg 加载成功！");
    //         onFFmpegLoaded?.(ffmpeg);
    //     } catch (error) {
    //         message.error("加载 FFmpeg 失败");
    //         console.error("加载 FFmpeg 失败:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    if (loaded) {
        return (
            <div className="w-full pl-6 flex flex-col items-center">
                {children}
            </div>
        );
    }

    return (
        <div className="w-full pt-20 px-10">
            <div className="">
                <h2 className="text-xl font-bold mb-2">欢迎使用音视频工具箱</h2>
                <p className="text-gray-500 mb-4">
                    首次使用需要加载核心组件（约 25MB），加载完成后即可使用所有功能
                </p>
                <p className="text-gray-400 text-sm">
                    核心组件仅需加载一次，之后将自动保存在浏览器中
                </p>
                <Button
                    className="w-full"
                    type="primary"
                    size="large"
                    onClick={load}
                    loading={loading}
                    icon={loading ? <LoadingOutlined /> : null}
                >
                    加载核心组件
                </Button>
                <p></p>
                {loading && (
                    <div className="text-gray-500">
                        <Spin /> 正在加载 FFmpeg 核心文件...
                    </div>
                )}
            </div>
        </div >
    );
}