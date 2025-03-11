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
  const [downloadUrls, setDownloadUrls] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [files, setFiles] = useState<FileList | null>(null);

  const compressImages = async () => {
    if (!ffmpeg || !files) return;
    try {
      setProcessing(true);
      setProgress(0);
      setDownloadUrls([]);

      const values = await form.validateFields();
      let totalProgress = 0;
      const fileArray = Array.from(files);
      const compressedUrls: string[] = new Array(fileArray.length).fill('');

      // 先清理可能存在的文件
      try {
        for (let i = 0; i < fileArray.length; i++) {
          try {
            await ffmpeg.deleteFile(`input_${i}.jpg`);
            await ffmpeg.deleteFile(`output_${i}.jpg`);
          } catch (e) {
            // 忽略不存在的文件错误
          }
        }
      } catch (e) {
        console.log('清理文件失败，继续执行', e);
      }

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        try {
          // 使用更安全的文件名
          const inputFileName = `input_${i}_${Date.now()}.jpg`;
          const outputFileName = `output_${i}_${Date.now()}.jpg`;
          
          // 处理单个文件
          await ffmpeg.writeFile(inputFileName, await fetchFile(file));
          setProgress((totalProgress += 30 / fileArray.length));

          await ffmpeg.exec([
            "-i", inputFileName,
            "-quality", values.quality.toString(),
            "-resize", `${values.size}%`,
            outputFileName
          ]);

          setProgress((totalProgress += 50 / fileArray.length));
          const data = await ffmpeg.readFile(outputFileName) as any;
          const blobUrl = URL.createObjectURL(new Blob([data.buffer], { type: "image/jpeg" }));
          compressedUrls[i] = blobUrl;
          
          // 清理文件
          try {
            await ffmpeg.deleteFile(inputFileName);
            await ffmpeg.deleteFile(outputFileName);
          } catch (e) {
            console.log('清理文件失败', e);
          }
        } catch (error) {
          console.error(`处理第 ${i+1} 张图片失败:`, error);
          message.error(`第 ${i+1} 张图片处理失败`);
          compressedUrls[i] = '';
        }
      }

      setDownloadUrls(compressedUrls);
      setProgress(100);
      message.success("图片批量压缩完成！");
    } catch (error) {
      message.error("图片压缩失败");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full mx-auto shadow-lg">
      <div className="flex flex-col items-center space-y-6 p-4">
        {previewUrls.length > 0 && (
          <div className="w-full flex justify-center gap-4 flex-wrap">
            {previewUrls.map((url, index) => (
              <div key={index} className="text-center relative">
                <p className="mb-2">原图 {index + 1}</p>
                <div className="relative">
                  <Image
                    src={url}
                    alt={`原图 ${index + 1}`}
                    className="max-w-xs"
                    style={{ height: '200px', objectFit: 'contain' }}
                  />
                  {processing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <Progress 
                        type="circle" 
                        percent={progress} 
                        size={80}
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                      />
                    </div>
                  )}
                </div>
                {downloadUrls[index] && (
                  <div className="text-center mt-2">
                    <p className="mb-2">压缩后</p>
                    <Image
                      src={downloadUrls[index]}
                      alt={`压缩后 ${index + 1}`}
                      className="max-w-xs"
                      style={{ height: '200px', objectFit: 'contain' }}
                    />
                    <div className="mt-2">
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        href={downloadUrls[index]}
                        download={`compressed_image_${index + 1}.jpg`}
                        disabled={!downloadUrls[index]}
                      >
                        下载压缩后的图片
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
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
              multiple
              beforeUpload={(file, fileList) => {
                // 将 RcFile[] 转换为 FileList 对象
                const dataTransfer = new DataTransfer();
                fileList.forEach(file => dataTransfer.items.add(file));
                setFiles(dataTransfer.files);
                setPreviewUrls(Array.from(fileList).map(file => URL.createObjectURL(file)));
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
                选择图片进行批量压缩
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item className="text-center">
            <Button
              type="primary"
              size="large"
              onClick={compressImages}
              disabled={!files || processing}
            >
              开始压缩
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
}