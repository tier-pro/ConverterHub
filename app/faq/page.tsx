import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about ConverterHub: how tools work, privacy, file processing, and more. All tools run 100% client-side.',
  openGraph: { title: 'FAQ | ConverterHub', description: 'Find answers to common questions about ConverterHub tools, privacy, and usage.' },
};

const FaqClient = dynamic(() => import('./FaqClient'), { ssr: false });

export default function FAQPage() {
  return <FaqClient />;
}
