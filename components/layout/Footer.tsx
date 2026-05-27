'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeftRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <ArrowLeftRight className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-text-primary">ConverterHub</span>
            </div>
            <p className="text-sm text-text-secondary">Your all-in-one toolkit for everyday conversions and calculations. Fast, free, and privacy-focused.</p>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary mb-3">Tools</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/converters/length-converter" className="hover:text-primary transition-colors">Length Converter</Link></li>
              <li><Link href="/converters/weight-converter" className="hover:text-primary transition-colors">Weight Converter</Link></li>
              <li><Link href="/text-tools/case-converter" className="hover:text-primary transition-colors">Case Converter</Link></li>
              <li><Link href="/dev-tools/password-generator" className="hover:text-primary transition-colors">Password Generator</Link></li>
              <li><Link href="/dev-tools/qr-code-generator" className="hover:text-primary transition-colors">QR Code Generator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary mb-3">Categories</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/converters/length-converter" className="hover:text-primary transition-colors">Unit Converters</Link></li>
              <li><Link href="/text-tools/case-converter" className="hover:text-primary transition-colors">Text Tools</Link></li>
              <li><Link href="/color-tools/color-converter" className="hover:text-primary transition-colors">Color Tools</Link></li>
              <li><Link href="/image-tools/image-resizer" className="hover:text-primary transition-colors">Image Tools</Link></li>
              <li><Link href="/pdf-tools/merge-pdf" className="hover:text-primary transition-colors">PDF Tools</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-text-secondary">
          <p>&copy; {new Date().getFullYear()} ConverterHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
