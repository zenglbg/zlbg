import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  // 基础 URL
  const baseUrl = 'https://zenglbg.github.com'

  // 静态路由
  const staticRoutes = [
    '',
    '/about',
    '/color',
    '/regex',
    '/qrcode',
    '/posts',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  }))

  // 获取文章路由
  const postsDirectory = path.join(process.cwd(), 'posts')
  const postRoutes = fs.readdirSync(postsDirectory)
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      url: `${baseUrl}/posts/${file.replace('.md', '')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  return [...staticRoutes, ...postRoutes]
}