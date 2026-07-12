import React from 'react';
import './globals.css';
import ClientLayout from './ClientLayout';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

const siteName = 'ConverterHub';
const siteDescription = '50+ free online converters, calculators, and developer tools. All client-side, no uploads, no limits.';

export const metadata: Metadata = {
  title: { default: `${siteName} - Free Online Converters & Calculators`, template: `%s | ${siteName}` },
  description: siteDescription,
  keywords: ['free online converter', 'unit converter', 'image converter', 'PDF tools', 'developer tools', 'online calculator'],
  metadataBase: new URL('https://converter-hub-nine.vercel.app'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName,
    title: `${siteName} - Free Online Converters & Calculators`,
    description: siteDescription,
    url: 'https://converter-hub-nine.vercel.app',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: siteName, description: siteDescription },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="YHiwzNkZ3x-7n0u1ARKKAFCVSRewgER98Ec_aYOwcrc" />
        <meta name="theme-color" content="#0B7B83" />
        <Script id="gtm" strategy="beforeInteractive" dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-M3BH8JP5');`
        }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('converterhub-storage');if(s){var d=JSON.parse(s);if(d.state&&d.state.theme==='dark'){document.documentElement.classList.add('dark');}}else if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.classList.add('dark');}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: siteName,
              url: 'https://converter-hub-nine.vercel.app',
              description: siteDescription,
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: 'https://converter-hub-nine.vercel.app/?q={search_term_string}' },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background">
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M3BH8JP5" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
        </noscript>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-white">
          Skip to content
        </a>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
