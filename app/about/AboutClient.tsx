'use client';
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Shield, Zap, Eye, Smartphone } from 'lucide-react';

export default function AboutClient() {
  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <h1 className="text-3xl font-bold text-text-primary">About ConverterHub</h1>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">Our Mission</h2>
        <p className="text-text-secondary leading-relaxed">
          We believe that essential online tools should be free for everyone, respectful of your privacy, 
          easy to use, and accurate. ConverterHub was created to provide a comprehensive collection of 
          conversion and utility tools that anyone can use without barriers.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {[
          { icon: <Shield className="w-6 h-6" />, title: '100% Free', desc: 'All tools are completely free. No registration, no hidden fees, no premium tiers.' },
          { icon: <Zap className="w-6 h-6" />, title: 'Blazing Fast', desc: 'Client-side processing means instant results. No server round-trips required.' },
          { icon: <Eye className="w-6 h-6" />, title: 'Privacy First', desc: 'All processing happens in your browser. We never see your data or uploaded files.' },
          { icon: <Smartphone className="w-6 h-6" />, title: 'Mobile Friendly', desc: 'Works seamlessly on all devices from phones to desktops.' },
        ].map((f) => (
          <Card key={f.title} className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">{f.icon}</div>
            <h3 className="font-semibold text-text-primary mb-1">{f.title}</h3>
            <p className="text-sm text-text-secondary">{f.desc}</p>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">What We Offer</h2>
        <ul className="list-disc pl-6 space-y-2 text-text-secondary">
          <li>34+ free tools and converters across 10 categories</li>
          <li>Unit converters, text tools, color tools, image tools, and more</li>
          <li>No registration required</li>
          <li>No data collection</li>
          <li>Client-side processing for complete privacy</li>
          <li>Regular updates and improvements</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">Technology</h2>
        <p className="text-text-secondary leading-relaxed">
          Built with modern web technologies including Next.js, React, TypeScript, and TailwindCSS. 
          All file processing happens client-side using Canvas API, pdf-lib, and other browser-native libraries.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">Contact</h2>
        <p className="text-text-secondary">
          Have questions or suggestions? Reach out to us at{' '}
          <a href="mailto:hello@converterhub.app" className="text-primary hover:underline">hello@converterhub.app</a>
        </p>
      </section>
    </div>
  );
}
