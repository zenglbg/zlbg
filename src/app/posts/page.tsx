'use client';
import { useEffect, useState } from 'react';
import { Card, Space, Typography, Menu } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import { useRouter } from 'next/navigation';
import { AppstoreOutlined, TagOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface Post {
  title: string;
  content: string;
  desc: string;
  date: string;
  slug: string;
  category: string; // 添加分类字段
}

export default function Posts() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        console.log("🚀 ~ fetchPosts ~ data:", data)
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const categories = Array.from(new Set(posts.map(post => post.category)));

  return (
    <MainLayout>
      <div className="flex">
        <Menu
          mode="inline"
          style={{ width: 256 }}
          onSelect={({ key }) => setSelectedCategory(key)}
          selectedKeys={selectedCategory ? [selectedCategory] : []}
        >
          <Menu.Item key="all" icon={<AppstoreOutlined />} onClick={() => setSelectedCategory(null)}>
            全部
          </Menu.Item>
          {categories.map(category => (
            <Menu.Item key={category} icon={<TagOutlined />}>
              {category}
            </Menu.Item>
          ))}
        </Menu>
        <Space direction="vertical" size="large" className="w-full pl-8">
          <Title level={3} className="text-primary">文章列表</Title>
          {posts
            .filter(post => !selectedCategory || post.category === selectedCategory)
            .map((post, index) => (
              <Card
                key={index}
                title={post.title}
                className="border-secondary/20 hover:border-secondary/40 transition-colors cursor-pointer"
                onClick={() => router.push(`/posts/${post.slug}`)}
              >
                <Paragraph className="line-clamp-3">
                  {post.desc}
                </Paragraph>
                <div className="text-right text-primary/60">
                  {post.date}
                </div>
              </Card>
            ))}
        </Space>
      </div>
    </MainLayout>
  );
}