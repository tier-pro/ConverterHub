import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ConverterHub privacy policy. We do not collect, store, or transmit your data. All processing happens entirely in your browser.',
  openGraph: { title: 'Privacy Policy | ConverterHub', description: 'We do not collect, store, or transmit your data. All processing happens entirely in your browser.' },
};

const PrivacyClient = dynamic(() => import('./PrivacyClient'), { ssr: false });

export default function PrivacyPolicyPage() {
  return <PrivacyClient />;
}
