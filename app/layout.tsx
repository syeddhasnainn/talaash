import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter} from 'next/font/google';
import './globals.css';
import {
  ClerkProvider,
} from '@clerk/nextjs';
import { Toaster } from "sonner"


const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});


export const metadata: Metadata = {
  title: 'Talaash',
  description: 'AI chat app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased dark`}>
          {children}
          <Analytics />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
