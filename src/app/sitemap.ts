import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.zlbg.cc'

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

  const postsDirectory = path.join(process.cwd(), 'posts')
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true })

  const postRoutes = entries.flatMap(entry => {
    if (entry.isDirectory()) {
      const categoryPath = path.join(postsDirectory, entry.name)
      const files = fs.readdirSync(categoryPath)

      return files
        .filter(file => file.endsWith('.md'))
        .map(file => ({
          url: `${baseUrl}/posts/${entry.name}/${file.replace('.md', '')}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      return {
        url: `${baseUrl}/posts/${entry.name.replace('.md', '')}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }
    }
    return null
  }).filter(Boolean)

  return [...staticRoutes, ...(postRoutes as MetadataRoute.Sitemap)]
}