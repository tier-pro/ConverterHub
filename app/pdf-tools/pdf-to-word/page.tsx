import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to Word Converter - Free Online Tool',
  description: 'Extract text from PDF files and download as editable Word documents (.docx). Free, no upload, 100% private — all processing happens in your browser.',
  keywords: ['pdf to word', 'pdf to text', 'convert pdf to docx', 'free pdf converter', 'extract text from pdf'],
  openGraph: {
    title: 'PDF to Word Converter - Free Online Tool | ConverterHub',
    description: 'Extract text from PDF files and download as editable Word documents (.docx). Free, no upload, 100% private.',
  },
  twitter: { title: 'PDF to Word Converter - Free Online Tool | ConverterHub', description: 'Extract text from PDF files and download as editable Word documents.' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PDF to Word Converter',
  applicationCategory: 'DocumentApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  description: 'Extract text from PDF files and download as Word documents. 100% client-side.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const PdfToWordClient = dynamic(() => import('./PdfToWordClient'), { ssr: false });

export default function PdfToWordPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PdfToWordClient />
    </>
  );
}
