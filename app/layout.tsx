import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { Toaster } from "sonner"
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// const inter = Inter({
//   variable: '--font-inter',
//   subsets: ['latin'],
// });

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["100",'200','300','400','500','600','700','800','900']
// });

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
        <body className={`${geistSans.className} antialiased `}>
          {/* <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn> */}
          {children}
          <Analytics />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
