"use client";

import { useFFmpeg } from "@/contexts/FFmpegContext";
import { fetchFile } from "@ffmpeg/util";
import { Button, Upload, message, Progress, Card, Form, Slider, Select, Image } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";

export default function HomeImageCompress() {
  const { ffmpeg } = useFFmpeg();
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [form] = Form.useForm();

  const compressImage = async (file: File) => {
    if (!ffmpeg) return;
    try {
      setProcessing(true);
      setProgress(0);
      setDownloadUrl('');

      // 显示原图预览
      setPreviewUrl(URL.createObjectURL(file));

      const values = await form.validateFields();
      
      await ffmpeg.writeFile("input.jpg", await fetchFile(file));
      setProgress(30);

      await ffmpeg.exec([
        "-i", "input.jpg",
        "-quality", values.quality.toString(),
        "-resize", `${values.size}%`,
        "output.jpg"
      ]);

      setProgress(80);
      const data = await ffmpeg.readFile("output.jpg") as any;
      const blobUrl = URL.createObjectURL(
        new Blob([data.buffer], { type: "image/jpeg" })
      );

      setDownloadUrl(blobUrl);
      setProgress(100);
      message.success("图片压缩完成！");
    } catch (error) {
      message.error("图片压缩失败");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full  mx-auto shadow-lg">
      <div className="flex flex-col items-center space-y-6 p-4">
        {previewUrl && (
          <div className="w-full flex justify-center gap-4">
            <div className="text-center">
              <p className="mb-2">原图</p>
              <Image
                src={previewUrl}
                alt="原图"
                className="max-w-xs"
                style={{ height: '200px', objectFit: 'contain' }}
              />
            </div>
            {downloadUrl && (
              <div className="text-center">
                <p className="mb-2">压缩后</p>
                <Image
                  src={downloadUrl}
                  alt="压缩后"
                  className="max-w-xs"
                  style={{ height: '200px', objectFit: 'contain' }}
                />
              </div>
            )}
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          className="w-full"
          initialValues={{
            quality: 80,
            size: 100
          }}
        >
          <Form.Item
            label="压缩质量"
            name="quality"
            tooltip="图片质量百分比（建议：60-80）"
          >
            <Slider min={1} max={100} marks={{
              60: '压缩',
              80: '平衡',
              100: '原图'
            }} />
          </Form.Item>

          <Form.Item
            label="图片尺寸"
            name="size"
            tooltip="图片尺寸百分比"
          >
            <Slider min={10} max={100} marks={{
              50: '一半',
              75: '3/4',
              100: '原始'
            }} />
          </Form.Item>

          <Form.Item className="text-center">
            <Upload
              accept="image/*"
              beforeUpload={(file) => {
                compressImage(file);
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
                选择图片压缩
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
            download="compressed_image.jpg"
          >
            下载压缩后的图片
          </Button>
        )}
      </div>
    </Card>
  );
}