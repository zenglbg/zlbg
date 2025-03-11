"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { createContext, ReactNode, useContext, useState } from "react";
import { message } from "antd";

interface FFmpegContextType {
  ffmpeg: FFmpeg | null;
  loaded: boolean;
  loading: boolean;
  load: () => Promise<void>;
}

const FFmpegContext = createContext<FFmpegContextType>({
  ffmpeg: null,
  loaded: false,
  loading: false,
  load: async () => {},
});

export function FFmpegProvider({ children }: { children: ReactNode }) {
  const [ffmpeg] = useState(() => new FFmpeg());
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const baseURL = "/ffmpeg";

      ffmpeg.on("log", ({ message: msg }) => {
        // message.info(msg);
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });

      setLoaded(true);
      message.success("FFmpeg 加载成功！");
    } catch (error) {
      message.error("加载 FFmpeg 失败");
      console.error("加载 FFmpeg 失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FFmpegContext.Provider value={{ ffmpeg, loaded, loading, load }}>
      {children}
    </FFmpegContext.Provider>
  );
}

export function useFFmpeg() {
  const context = useContext(FFmpegContext);
  if (!context) {
    throw new Error("useFFmpeg must be used within FFmpegProvider");
  }
  return context;
}