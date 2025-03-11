"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { useRef } from "react";

interface Props {
  ffmpeg: FFmpeg;
}

export default function HomeTranscode({ ffmpeg }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const transcode = async () => {
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
    <div className="flex flex-col items-center justify-center h-full">
      <video ref={videoRef} controls className="max-w-2xl mb-6"></video>
      <button
        onClick={transcode}
        className="bg-green-500 hover:bg-green-700 text-white py-3 px-6 rounded"
      >
        转换 AVI 到 MP4
      </button>
      <p ref={messageRef} className="mt-4 text-gray-600"></p>
    </div>
  );
}