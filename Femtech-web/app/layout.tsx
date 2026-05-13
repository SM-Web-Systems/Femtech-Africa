import type { Metadata } from "next";
import { Inter } from "next/font/google"
import Navigation from './components/Navigation';
import { Providers } from './components/providers';
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "MamaTokens - Maternal Health & Rewards",
  description: "Earn tokens by completing pregnancy milestones and quizzes. Spend them on healthcare services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
