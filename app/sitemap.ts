import { MetadataRoute } from 'next';
import { toolCategories } from '@/lib/constants/tools';

const highTraffic = [
  '/image-tools/background-remover',
  '/image-tools/video-to-gif',
  '/pdf-tools/pdf-to-word',
  '/financial-tools/invoice-generator',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://converter-hub-nine.vercel.app';

  const toolUrls = toolCategories.flatMap(cat =>
    cat.tools.map(tool => ({
      url: `${base}${tool.path}`,
      priority: highTraffic.includes(tool.path) ? 0.9 as const : 0.8 as const,
    }))
  );

  return [
    { url: base, priority: 1.0 },
    ...toolUrls,
    { url: `${base}/about`, priority: 0.5 },
    { url: `${base}/privacy-policy`, priority: 0.3 },
    { url: `${base}/terms-of-service`, priority: 0.3 },
    { url: `${base}/faq`, priority: 0.5 },
    { url: `${base}/sitemap`, priority: 0.3 },
  ];
}
