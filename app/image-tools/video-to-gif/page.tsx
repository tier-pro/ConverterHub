import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video to GIF Maker - Free Online Converter',
  description: 'Convert any video clip to an animated GIF for free. No upload, no watermark, no file size limits. 100% client-side processing.',
  keywords: ['video to gif', 'gif maker', 'mp4 to gif', 'create gif from video', 'free gif converter'],
  openGraph: {
    title: 'Video to GIF Maker - Free Online Converter | ConverterHub',
    description: 'Convert any video clip to an animated GIF for free. No upload, no watermark, no file size limits.',
  },
  twitter: { title: 'Video to GIF Maker - Free Online Converter | ConverterHub', description: 'Convert any video clip to an animated GIF for free.' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Video to GIF Maker',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  description: 'Convert video clips to animated GIFs. Free, no watermark, no file size limits.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const VideoToGifClient = dynamic(() => import('./VideoToGifClient'), { ssr: false });

export default function VideoToGifPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <VideoToGifClient />
    </>
  );
}
