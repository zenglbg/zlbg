"use client";

import { useFFmpeg } from "@/contexts/FFmpegContext";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Button, message, Upload } from "antd";
import { useRef } from "react";
 
export default function HomeCompress() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { ffmpeg } = useFFmpeg();

  const compressVideo = async (file: File) => {
    try {
      await ffmpeg?.writeFile("input.mp4", await fetchFile(file));
      await ffmpeg?.exec([
        "-i", "input.mp4",
        "-c:v", "libx264",
        "-crf", "28",
        "-preset", "medium",
        "output.mp4"
      ]);
      
      const data = await ffmpeg?.readFile("output.mp4") as any;
      if (videoRef.current) {
        videoRef.current.src = URL.createObjectURL(
          new Blob([data.buffer], { type: "video/mp4" })
        );
      }
      message.success("视频压缩完成！");
    } catch (error) {
      message.error("视频压缩失败");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <video ref={videoRef} controls className="max-w-2xl mb-6"></video>
      <Upload
        accept="video/*"
        beforeUpload={(file) => {
          compressVideo(file);
          return false;
        }}
        showUploadList={false}
      >
        <Button type="primary" size="large">选择视频压缩</Button>
      </Upload>
    </div>
  );
}