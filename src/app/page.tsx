'use client'

import NoSSRWrapper from "./NoSSRWrapper";
import Home from "./Home";
import MainLayout from "@/components/layout/MainLayout";
import { FFmpegProvider } from "@/contexts/FFmpegContext";

export default function Page() {
  return <NoSSRWrapper>
    <MainLayout>
      <FFmpegProvider>
        <Home />
      </FFmpegProvider>
    </MainLayout>
  </NoSSRWrapper>
}
