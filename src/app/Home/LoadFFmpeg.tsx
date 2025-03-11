"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { cloneElement, ReactElement, useState } from "react";
import { Button, Card, message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useFFmpeg } from "@/contexts/FFmpegContext";
import { useTranslations } from "next-intl";

interface Props {
    children: ReactElement;
    onFFmpegLoaded?: (ffmpeg: FFmpeg) => void;
}

export default function LoadFFmpeg({ children, onFFmpegLoaded }: Props) {

    const { load, loaded, loading } = useFFmpeg()
    const t = useTranslations()
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
                <h2 className="text-xl font-bold mb-2">{t('title')}</h2>
                <p className="text-gray-500 mb-4">
                    首次使用需要加载核心组件（约 25MB），加载完成后即可使用所有功能
                </p>
                <p className="text-gray-400 text-sm">
                    核心组件仅需加载一次，之后将自动保存在浏览器中
                </p>
                <p className="text-green-500 text-sm mb-4">
                    <strong>隐私提示：</strong> 您的文件仅会在本地浏览器中处理，不会上传到任何服务器，请放心使用。
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