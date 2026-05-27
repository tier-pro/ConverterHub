import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ConverterHub terms of service. Free use of online conversion tools with no warranty. All tools provided as-is for personal and commercial use.',
  openGraph: { title: 'Terms of Service | ConverterHub', description: 'Free use of online conversion tools. All tools provided as-is.' },
};

const TermsClient = dynamic(() => import('./TermsClient'), { ssr: false });

export default function TermsOfServicePage() {
  return <TermsClient />;
}
