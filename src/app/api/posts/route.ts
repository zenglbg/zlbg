import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import dayjs from 'dayjs';

export async function GET() {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    console.log(postsDirectory, 'postsDirectorypostsDirectory')
    const entries = await fs.readdir(postsDirectory, { withFileTypes: true });

    const posts = await Promise.all(
      entries.map(async (entry) => {
        if (entry.isDirectory()) {
          // 处理文件夹中的 Markdown 文件
          const category = entry.name;
          const categoryPath = path.join(postsDirectory, category);
          const files = await fs.readdir(categoryPath);

          return Promise.all(
            files
              .filter(file => file.endsWith('.md'))
              .map(async (file) => {
                const filePath = path.join(categoryPath, file);
                const content = await fs.readFile(filePath, 'utf8');
                const { data, content: markdownContent } = matter(content);

                return {
                  title: data.title || '无标题',
                  date: data.date || dayjs().format("YYYY-MM-DD HH:mm:ss"),
                  category: category, // 使用文件夹名称作为分类
                  slug: `${category}|${file.replace('.md', '')}`,
                  desc: data.desc,
                  content: markdownContent.slice(0, 200) + '...',
                };
              })
          );
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          // 处理根目录中的 Markdown 文件
          const filePath = path.join(postsDirectory, entry.name);
          const content = await fs.readFile(filePath, 'utf8');
          const { data, content: markdownContent } = matter(content);

          return {
            title: data.title || '无标题',
            date: data.date || dayjs().format("YYYY-MM-DD HH:mm:ss"),
            category: '未分类', // 根目录文件默认分类
            desc: data.desc,
            slug: entry.name.replace('.md', ''),
            content: markdownContent.slice(0, 200) + '...',
          };
        }
      })
    );

    return NextResponse.json(posts.flat().filter(Boolean)); // 过滤掉 undefined
  } catch (error) {
    console.error('Failed to read posts:', error);
    return NextResponse.json({ error: 'Failed to read posts' }, { status: 500 });
  }
}