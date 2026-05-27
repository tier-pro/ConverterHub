'use client';
import React from 'react';
import { Card } from '@/components/ui/Card';
import { FileText, CheckCircle, AlertTriangle, Shield, Scale, BookOpen, RefreshCw } from 'lucide-react';

const sections = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Acceptance of Terms',
    content: 'By accessing or using ConverterHub, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services. We reserve the right to update these terms at any time without prior notice.'
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: 'Use of Service — Permitted',
    content: 'ConverterHub grants you a non-exclusive, non-transferable license to use our tools for personal, non-commercial purposes. You may use all tools freely without registration. All tools are provided for lawful purposes only.'
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: 'Use of Service — Prohibited',
    content: 'You agree not to: (a) attempt to reverse engineer, decompile, or disassemble any part of our tools; (b) use our services for any illegal activity; (c) attempt to overload, disrupt, or harm our infrastructure; (d) scrape, crawl, or automatically access our services without explicit permission; (e) use our tools to process illegal or harmful content.'
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Disclaimer of Warranties',
    content: 'ConverterHub is provided "as is" and "as available" without any warranty of any kind, whether express or implied. We do not guarantee that our tools will be error-free, uninterrupted, or meet your specific requirements. Use of our tools is at your own risk.'
  },
  {
    icon: <Scale className="w-5 h-5" />,
    title: 'Limitation of Liability',
    content: 'ConverterHub and its operators shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of our services. This includes, but is not limited to, data loss, financial loss, or business interruption, even if we have been advised of the possibility of such damages.'
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: 'Accuracy',
    content: 'While we strive to ensure the accuracy of our conversion tools and calculators, results are provided for informational purposes only. They should not be used as a substitute for professional advice in critical fields such as medicine, engineering, finance, or law. Always verify critical calculations independently.'
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: 'Changes to Terms',
    content: 'We reserve the right to modify these terms at any time. Changes take effect immediately upon posting. Your continued use of ConverterHub after changes constitutes acceptance of the modified terms. We encourage you to review this page periodically.'
  },
];

export default function TermsClient() {
  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <h1 className="text-3xl font-bold text-text-primary">Terms of Service</h1>
      <p className="text-text-secondary">Last updated: January 1, 2026</p>

      <div className="space-y-6">
        {sections.map((s) => (
          <Card key={s.title} className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {s.icon}
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-text-primary">{s.title}</h2>
                <p className="text-text-secondary leading-relaxed">{s.content}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
