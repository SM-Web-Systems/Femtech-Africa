// app/layout.tsx
import type { Metadata } from 'next';
import { Providers } from '@/components/providers/Providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Mamatokens - Maternal Health Platform',
  description: 'AI-powered maternal health tracking and token rewards platform',
  icons: {
    icon: '/favicon.ico',
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
