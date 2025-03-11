"use client";

import { useFFmpeg } from "@/contexts/FFmpegContext";
import { fetchFile } from "@ffmpeg/util";
import { Button, Upload, message, Progress, Card, Form, Slider, Select } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";

export default function HomeCompress() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { ffmpeg } = useFFmpeg();
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [form] = Form.useForm();

  const compressVideo = async (file: File) => {
    if (!ffmpeg) return;
    try {
      setProcessing(true);
      setProgress(0);
      setDownloadUrl('');

      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      const values = await form.validateFields();

      await ffmpeg.writeFile("input.mp4", await fetchFile(file));
      setProgress(20);

      await ffmpeg.exec([
        "-i", "input.mp4",
        "-c:v", "libx264",
        "-crf", values.quality.toString(),
        "-preset", values.speed,
        "-c:a", "aac",
        "-b:a", "128k",
        "output.mp4"
      ]);

      setProgress(80);
      const data = await ffmpeg.readFile("output.mp4") as any;
      const blobUrl = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );

      if (videoRef.current) {
        videoRef.current.src = blobUrl;
      }
      setDownloadUrl(blobUrl);
      setProgress(100);
      message.success("视频压缩完成！");
    } catch (error) {
      message.error("视频压缩失败");
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
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <div className="flex flex-col items-center space-y-6 p-4">
        <video ref={videoRef} controls className="w-full mb-6"></video>

        <Form
          form={form}
          layout="vertical"
          className="w-full"
          initialValues={{
            quality: 28,
            speed: "medium"
          }}
        >
          <Form.Item
            label="压缩质量"
            name="quality"
            tooltip="值越小质量越高，文件越大（建议：18-28）"
          >
            <Slider min={0} max={51} marks={{
              18: '高质量',
              28: '平衡',
              35: '低质量'
            }} />
          </Form.Item>

          <Form.Item
            label="压缩速度"
            name="speed"
            tooltip="速度越快压缩效率越低"
          >
            <Select options={[
              { label: '最快（质量最低）', value: 'ultrafast' },
              { label: '快速', value: 'veryfast' },
              { label: '平衡', value: 'medium' },
              { label: '慢速（质量较好）', value: 'slow' },
              { label: '最慢（质量最好）', value: 'veryslow' },
            ]} />
          </Form.Item>

          <Form.Item className="text-center">
            <Upload
              accept="video/*"
              beforeUpload={(file) => {
                compressVideo(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button
                type="primary"
                size="large"
                icon={<UploadOutlined />}
                loading={processing}
              >
                选择视频压缩
              </Button>
            </Upload>
          </Form.Item>
        </Form>

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

        {downloadUrl && (
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            href={downloadUrl}
            download="compressed_video.mp4"
          >
            下载压缩后的视频
          </Button>
        )}
      </div>
    </Card>
  );
}