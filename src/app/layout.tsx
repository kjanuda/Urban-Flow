// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ConditionalLayout from './Components/ConditionalLayout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'City Problem Reporter - Report Issues, Drive Change',
  description: 'Empower citizens to report city problems and local authorities to take action efficiently. Connect communities with government for faster problem-solving and urban governance.',
  keywords: ['City Reporter', 'Problem Reporting', 'Civic Engagement', 'Urban Governance', 'Smart City', 'Citizen Engagement', 'Local Government'],
  authors: [{ name: 'City Problem Reporter Team' }],
  creator: 'City Problem Reporter',
  publisher: 'City Problem Reporter',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cityreporter.com',
    title: 'City Problem Reporter - Report Issues, Drive Change',
    description: 'Empower citizens to report city problems and local authorities to take action efficiently.',
    siteName: 'City Problem Reporter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'City Problem Reporter',
    description: 'Report city issues and drive positive urban change',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}