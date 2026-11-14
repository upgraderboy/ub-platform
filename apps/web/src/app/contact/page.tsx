import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ContactPageClient } from '../../components/ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact | Upgrader Boy',
  description:
    'Get in touch with Ankit Bhuria — founder of Upgrader Boy. Send a message, connect on social media, or schedule a consultation for your next project.',
  keywords: [
    'Upgrader Boy Contact',
    'Ankit Bhuria',
    'Hire Full-Stack Developer',
    'Next.js Developer India',
    'Jhunjhunu Rajasthan Software',
  ],
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <ContactPageClient />
      </main>

      <Footer />
    </div>
  );
}
