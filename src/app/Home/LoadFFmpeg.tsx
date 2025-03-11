"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { cloneElement, ReactElement, useState } from "react";
import { Button, message, Spin } from "antd";
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
            <div className="w-full flex flex-col justify-center items-center">
                {children}
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center items-center">
            <Button
                type="primary"
                size="large"
                onClick={load}
                loading={loading}
                icon={loading ? <LoadingOutlined /> : null}
            >
                加载 FFmpeg
            </Button>
            {loading && (
                <div className="text-gray-500">
                    <Spin /> 正在加载 FFmpeg 核心文件...
                </div>
            )}
        </div>
    );
}