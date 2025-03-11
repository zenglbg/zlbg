import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    console.log(postsDirectory, 'postsDirectorypostsDirectory')
    const files = await fs.readdir(postsDirectory);
    
    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async (file) => {
          const filePath = path.join(postsDirectory, file);
          const content = await fs.readFile(filePath, 'utf8');
          const { data, content: markdownContent } = matter(content);
          
          return {
            title: data.title || '无标题',
            date: data.date || new Date().toISOString(),
            slug: file.replace('.md', ''),
            content: markdownContent.slice(0, 200) + '...',
          };
        })
    );

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to read posts:', error);
    return NextResponse.json({ error: 'Failed to read posts' }, { status: 500 });
  }
}