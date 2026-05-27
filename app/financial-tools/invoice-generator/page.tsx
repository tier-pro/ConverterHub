import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Invoice Generator - Create Professional PDF Invoices',
  description: 'Create and download professional PDF invoices for free. Add line items, tax, discounts, and notes. No sign-up required — 100% client-side.',
  keywords: ['invoice generator', 'free invoice template', 'create invoice online', 'pdf invoice maker', 'professional invoice'],
  openGraph: {
    title: 'Free Invoice Generator - Create Professional PDF Invoices | ConverterHub',
    description: 'Create and download professional PDF invoices for free. Add line items, tax, discounts, and notes. No sign-up required.',
  },
  twitter: { title: 'Free Invoice Generator | ConverterHub', description: 'Create and download professional PDF invoices for free.' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Invoice Generator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  description: 'Create professional PDF invoices with line items, tax, and discounts. Free, no sign-up required.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const InvoiceGeneratorClient = dynamic(() => import('./InvoiceGeneratorClient'), { ssr: false });

export default function InvoiceGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <InvoiceGeneratorClient />
    </>
  );
}
