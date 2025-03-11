'use client';
import { useEffect, useState } from 'react';
import { Card, Space, Typography } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

interface Post {
  title: string;
  content: string;
  date: string;
  slug: string;
}

export default function Posts() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <MainLayout>
      <Space direction="vertical" size="large" className="w-full">
        <Title level={3} className="text-primary">文章列表</Title>
        {posts.map((post, index) => (
          <Card 
            key={index}
            title={post.title}
            className="border-secondary/20 hover:border-secondary/40 transition-colors cursor-pointer"
            onClick={() => router.push(`/posts/${post.slug}`)}
          >
            <Paragraph className="line-clamp-3">
              {post.content}
            </Paragraph>
            <div className="text-right text-primary/60">
              {post.date}
            </div>
          </Card>
        ))}
      </Space>
    </MainLayout>
  );
}