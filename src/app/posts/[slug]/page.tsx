'use client';
import { useEffect, useState } from 'react';
import { Typography, Spin } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import { marked } from 'marked';
import { useParams } from 'next/navigation';

const { Title } = Typography;

export default function PostDetail() {
  const [post, setPost] = useState<{ title: string; content: string; date: string } | null>(null);
  const params = useParams();


  useEffect(() => {
    console.log(params, 'paramsparamsparamsparams')
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.slug}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      }
    };

    fetchPost();
  }, [params.slug]);

  if (!post) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <article className="prose prose-slate max-w-none">
        <Title level={2} className="text-primary mb-8">{post.title}</Title>
        <div className="text-right text-primary/60 mb-8">{post.date}</div>
        <div
          dangerouslySetInnerHTML={{ __html: marked(post.content) }}
          className="leading-relaxed prose-headings:text-primary prose-a:text-blue-600 prose-strong:text-primary/90 prose-code:text-blue-600 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic"
        />
      </article>
    </MainLayout>
  );
}