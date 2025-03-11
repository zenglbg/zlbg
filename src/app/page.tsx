'use client'

import NoSSRWrapper from "./NoSSRWrapper";
import Home from "./Home";
import MainLayout from "@/components/layout/MainLayout";

export default function Page() {
  return <NoSSRWrapper>
    <MainLayout>
      <Home />
    </MainLayout>
  </NoSSRWrapper>
}
