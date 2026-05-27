import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Background Remover - Remove Image Backgrounds Online',
  description: 'Remove image backgrounds instantly with AI — 100% free, private, and runs entirely in your browser. No upload to servers. Works with JPG, PNG, WebP.',
  keywords: ['background remover', 'remove background from image', 'free background removal', 'ai background remover', 'transparent background maker'],
  openGraph: {
    title: 'Free AI Background Remover - Remove Image Backgrounds Online | ConverterHub',
    description: 'Remove image backgrounds instantly with AI — 100% free, private, and runs entirely in your browser. No upload to servers.',
  },
  twitter: { title: 'Free AI Background Remover | ConverterHub', description: 'Remove image backgrounds instantly with AI — free and private.' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI Background Remover',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript and WebAssembly support',
  description: 'Remove image backgrounds instantly using AI. Runs entirely in the browser with no server uploads.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const BackgroundRemoverClient = dynamic(() => import('./BackgroundRemoverClient'), { ssr: false });

export default function BackgroundRemoverPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BackgroundRemoverClient />
    </>
  );
}
