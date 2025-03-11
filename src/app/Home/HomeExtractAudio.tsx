"use client";

import { useFFmpeg } from "@/contexts/FFmpegContext";
import { fetchFile } from "@ffmpeg/util";
import { Button, message, Upload, Progress, Card } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";

export default function HomeExtractAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { ffmpeg } = useFFmpeg();
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  const extractAudio = async (file: File) => {
    if (!ffmpeg) return;
    try {
      setProcessing(true);
      setProgress(0);
      setDownloadUrl('');

      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      await ffmpeg.writeFile("input.mp4", await fetchFile(file));
      setProgress(30);

      await ffmpeg.exec([
        "-i", "input.mp4",
        "-vn",
        "-acodec", "libmp3lame",
        "-q:a", "2",
        "output.mp3"
      ]);
      setProgress(80);

      const data = await ffmpeg.readFile("output.mp3") as any;
      const blobUrl = URL.createObjectURL(
        new Blob([data.buffer], { type: "audio/mp3" })
      );

      if (audioRef.current) {
        audioRef.current.src = blobUrl;
      }
      setDownloadUrl(blobUrl);
      setProgress(100);
      message.success("音频提取完成！");
    } catch (error) {
      message.error("音频提取失败");
      console.error(error);
    } finally {
      setProcessing(false);
      // 清除进度监听
      ffmpeg.off('progress', function (params) {
        console.log("🚀 ~ params:", params)
      });
    }
  };

  return (
    <Card className="w-full  mx-auto shadow-lg">
      <div className="flex flex-col items-center space-y-6 p-4">
        <audio ref={audioRef} controls className="w-full"></audio>

        <Upload
          accept="video/*"
          className="w-full children:w-full"
          beforeUpload={(file) => {
            extractAudio(file);
            return false;
          }}
          showUploadList={false}
        >
          <Button
            type="primary"
            size="large"
            className="w-full"
            icon={<UploadOutlined />}
            loading={processing}
          >
            选择视频提取音频
          </Button>
        </Upload>

        {processing && (
          <div className="w-full">
            <Progress
              percent={progress}
              status={progress === 100 ? "success" : "active"}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </div>
        )}
        <div className="h-1"></div>
        {downloadUrl && (
          <Button
            type="primary"
            className="w-full"
            size="large"
            icon={<DownloadOutlined />}
            href={downloadUrl}
            download={`extracted_audio.mp3`}
          >
            下载提取的音频
          </Button>
        )}
      </div>
    </Card>
  );
}