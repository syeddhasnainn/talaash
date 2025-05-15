import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';

const archivo = Archivo({
  variable: '--font-archivo',
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
        <body className={`${archivo.className} antialiased dark`}>
          {children}
          <Analytics />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
