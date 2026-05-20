import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: {
    default: 'UW Marketplace',
    template: '%s — UW Marketplace',
  },
  description: 'The peer-to-peer marketplace for University of Waterloo students. Buy and sell textbooks, electronics, furniture, bikes and more.',
  keywords: ['UW Marketplace', 'University of Waterloo', 'student marketplace', 'buy sell', 'Waterloo'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      {/* Prevent flash of wrong theme — runs before paint */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('uw-theme');
            if (t === 'light') document.documentElement.classList.remove('dark');
            else document.documentElement.classList.add('dark');
          } catch(e) {}
        `}} />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
