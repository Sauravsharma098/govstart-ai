import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context/app-context';

export const metadata: Metadata = {
  title: 'GovStart AI - Sovereign Government Procurement Platform for Startups',
  description: 'AI-powered government procurement platform designed to help startups and small businesses discover tenders, analyze DPIIT exemptions, and generate winning proposals.',
  keywords: ['government procurement', 'startups', 'tenders', 'DPIIT exemption', 'EMD waiver', 'tender proposal', 'Make in India'],
  authors: [{ name: 'GovStart AI Mission' }]
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
