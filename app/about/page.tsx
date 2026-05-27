import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'ConverterHub offers 50+ free online converters, calculators, and developer tools. All tools run 100% in your browser — no uploads, no servers, no limits.',
  openGraph: { title: 'About ConverterHub - Free Online Tools', description: '50+ free online converters running 100% in your browser.' },
  twitter: { title: 'About ConverterHub - Free Online Tools', description: '50+ free online converters running 100% in your browser.' },
};

const AboutClient = dynamic(() => import('./AboutClient'), { ssr: false });

export default function AboutPage() {
  return <AboutClient />;
}
