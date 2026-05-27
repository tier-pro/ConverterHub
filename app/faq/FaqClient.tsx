'use client';
import React from 'react';
import { Card } from '@/components/ui/Card';
import { HelpCircle, Wrench, Monitor, Lock } from 'lucide-react';

const categories = [
  {
    icon: <HelpCircle className="w-5 h-5" />,
    title: 'General Questions',
    items: [
      { q: 'Is ConverterHub really free?', a: 'Yes, all tools on ConverterHub are completely free. There are no premium tiers, hidden fees, or paid features. Everything is available to everyone without charge.' },
      { q: 'Do I need to create an account?', a: 'No account or registration is required. All tools are accessible immediately without signing up or providing any personal information.' },
      { q: 'Is my data safe when using ConverterHub?', a: 'Absolutely. All processing happens entirely in your browser using client-side JavaScript. Your files and data are never uploaded to any server or transmitted over the internet.' },
    ],
  },
  {
    icon: <Wrench className="w-5 h-5" />,
    title: 'Tools & Usage',
    items: [
      { q: 'Why are there slight differences in conversion results compared to other tools?', a: 'Minor rounding differences can occur due to varying precision levels and rounding algorithms. Our tools use high-precision calculations, but some conversions (e.g., currency) may have slight variances depending on the exchange rate source.' },
      { q: 'Is there a maximum file size for image/PDF tools?', a: 'Since all processing is client-side, the maximum file size depends on your browser and available memory. Most modern browsers can handle files up to 1-2GB, but performance may decrease with very large files.' },
      { q: 'Can I use ConverterHub offline?', a: 'Some tools may work offline once the page has been loaded, but most require an initial internet connection to load the application. Once loaded, many client-side tools can function without connectivity.' },
    ],
  },
  {
    icon: <Monitor className="w-5 h-5" />,
    title: 'Technical',
    items: [
      { q: 'Which browsers are supported?', a: 'ConverterHub works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser for the best experience.' },
      { q: 'Can I integrate ConverterHub tools into my own website?', a: 'Currently, we do not offer an official API or embeddable widgets. However, since our tools are client-side, you are welcome to link to our pages. Contact us if you have specific integration needs.' },
    ],
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: 'Privacy & Security',
    items: [
      { q: 'Do you track my usage or collect analytics?', a: 'No. We do not use analytics services, tracking pixels, or any form of user tracking. We have no way to see how individual users interact with our tools.' },
      { q: 'What happens to the files I upload?', a: 'Uploaded files are processed entirely in your browser and are never sent to any server. Once you close the page or tab, the files are cleared from memory. Nothing is stored or retained.' },
    ],
  },
];

export default function FaqClient() {
  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <h1 className="text-3xl font-bold text-text-primary">Frequently Asked Questions</h1>

      <div className="space-y-6">
        {categories.map((cat) => (
          <Card key={cat.title} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {cat.icon}
              </div>
              <h2 className="text-lg font-semibold text-text-primary">{cat.title}</h2>
            </div>
            <div className="space-y-2">
              {cat.items.map((item) => (
                <details key={item.q} className="group rounded-lg border border-border">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3 text-text-primary font-medium hover:bg-surface-secondary rounded-lg [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <svg className="h-5 w-5 shrink-0 text-text-secondary transition group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </summary>
                  <div className="px-4 pb-3 pt-1 text-text-secondary leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
