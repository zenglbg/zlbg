const fs = require('fs');
const path = require('path');

const baseUrl = 'https://www.zlbg.cc';

const staticRoutes = [
  '',
  '/about',
  '/color',
  '/regex',
  '/qrcode',
  '/posts',
].map(route => ({
  url: `${baseUrl}${route}`,
  lastModified: new Date().toISOString(),
  changeFrequency: 'weekly',
  priority: 1,
}));

const postsDirectory = path.join(process.cwd(), 'posts');
const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });

const postRoutes = entries.flatMap(entry => {
  if (entry.isDirectory()) {
    const categoryPath = path.join(postsDirectory, entry.name);
    const files = fs.readdirSync(categoryPath);

    return files
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        url: `${baseUrl}/posts/${entry.name}/${file.replace('.md', '')}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
  } else if (entry.isFile() && entry.name.endsWith('.md')) {
    return {
      url: `${baseUrl}/posts/${entry.name.replace('.md', '')}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  }
  return null;
}).filter(Boolean);

const sitemap = [...staticRoutes, ...postRoutes];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemap.map(route => `
    <url>
      <loc>${route.url}</loc>
      <lastmod>${route.lastModified}</lastmod>
      <changefreq>${route.changeFrequency}</changefreq>
      <priority>${route.priority}</priority>
    </url>
  `).join('')}
</urlset>`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemapXml);
console.log('Sitemap generated successfully!');