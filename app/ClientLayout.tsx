'use client';
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  useTheme();

  return (
    <>
      <Header onMenuToggle={() => setMobileMenu(!mobileMenu)} />
      <div className="flex">
        <Sidebar />
        {mobileMenu && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenu(false)} />
            <div className="absolute left-0 top-16 bottom-0 w-64 bg-surface border-r border-border overflow-y-auto p-4">
              <Sidebar />
            </div>
          </div>
        )}
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
