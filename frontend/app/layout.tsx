import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talaash",
  description: "Privacy-focused search app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    >
      <html lang='en'>
        <body>
          <SignedOut>
            <SignInButton/>
          </SignedOut>
          <SignedIn>
            {/* <UserButton /> */}
            {children}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
