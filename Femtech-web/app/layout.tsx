import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google"
import Navigation from './components/navigation';
import { AuthProvider } from './lib/AuthContext';
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" })


export const metadata: Metadata = {
  title: "Femtech Africa - Maternal Mental Health Support",
  description: "Supporting pregnant mothers' mental health journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${firaCode.variable} antialiased`}>
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
