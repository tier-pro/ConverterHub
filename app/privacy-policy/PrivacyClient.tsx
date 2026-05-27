'use client';
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Shield, Lock,Eye, FileText, Server, Cookie, Users, RefreshCw } from 'lucide-react';

const sections = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Introduction',
    content: 'ConverterHub is committed to protecting your privacy. This policy explains how we handle your information when you use our tools and services. By using ConverterHub, you agree to the practices described in this policy.'
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'Data Collection',
    content: 'We do not collect, store, or transmit any personal data, files, or uploaded content to any server. All processing is performed entirely within your browser. We do not have accounts, user profiles, or any backend database that stores user information.'
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: 'Local Storage',
    content: 'We use your browser\'s localStorage solely to remember your preferences, such as theme selection (light/dark mode), favorite tools, and recently used tools. This data never leaves your device and can be cleared at any time through your browser settings.'
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'File Processing',
    content: 'Any files you upload (images, PDFs, etc.) are processed entirely in your browser using JavaScript. Files are never uploaded to our servers or any third party. Once you close the page or clear your browser data, your files are permanently removed from memory.'
  },
  {
    icon: <Server className="w-5 h-5" />,
    title: 'Third-Party Services',
    content: 'ConverterHub does not integrate with any third-party analytics services, advertising networks, or external APIs that handle user data. We do not use Google Analytics, Facebook Pixel, or similar tracking services.'
  },
  {
    icon: <Cookie className="w-5 h-5" />,
    title: 'Cookies',
    content: 'ConverterHub does not use cookies. We rely solely on localStorage for storing preferences, which is not accessible to servers or third parties and is never transmitted over the network.'
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Children's Privacy",
    content: 'ConverterHub is not directed at children under 13. We do not knowingly collect any information from children. Since we collect no data from any user, children can use our tools with the same privacy protections as all other users.'
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: 'Changes to This Policy',
    content: 'We may update this privacy policy from time to time. Changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.'
  },
];

export default function PrivacyClient() {
  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <h1 className="text-3xl font-bold text-text-primary">Privacy Policy</h1>
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
