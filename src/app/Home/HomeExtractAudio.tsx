"use client";

import { useFFmpeg } from "@/contexts/FFmpegContext";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Button, message, Upload } from "antd";
import { useRef } from "react";
 

export default function HomeExtractAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { ffmpeg } = useFFmpeg();

  const extractAudio = async (file: File) => {
    try {
      await ffmpeg?.writeFile("input.mp4", await fetchFile(file));
      await ffmpeg?.exec([
        "-i", "input.mp4",
        "-vn",
        "-acodec", "libmp3lame",
        "-q:a", "2",
        "output.mp3"
      ]);
      
      const data = await ffmpeg?.readFile("output.mp3") as any;
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(
          new Blob([data.buffer], { type: "audio/mp3" })
        );
      }
      message.success("音频提取完成！");
    } catch (error) {
      message.error("音频提取失败");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <audio ref={audioRef} controls className="mb-6"></audio>
      <Upload
        accept="video/*"
        beforeUpload={(file) => {
          extractAudio(file);
          return false;
        }}
        showUploadList={false}
      >
        <Button type="primary" size="large">选择视频提取音频</Button>
      </Upload>
    </div>
  );
}