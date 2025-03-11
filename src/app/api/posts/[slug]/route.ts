import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const params = await context.params;
  
  if (!params?.slug) {
    return NextResponse.json(
      { error: 'Slug is required' },
      { status: 400 }
    );
  }

  try {
    const filePath = path.join(process.cwd(), 'posts', `${params.slug.replaceAll("|", '/')}.md`);
    const content = await fs.readFile(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);
    
    return NextResponse.json({
      title: data.title || '无标题',
      date: data.date || new Date().toISOString(),
      content: markdownContent,
    });
  } catch (error) {
    console.error('Failed to read post:', error);
    return NextResponse.json(
      { error: 'Failed to read post' },
      { status: 404 }
    );
  }
}