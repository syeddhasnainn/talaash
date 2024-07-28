import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const monst = Montserrat({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Talaash",
  description: "AI Chat App with Artifacts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider signInForceRedirectUrl={`/new`}>
      <html lang="en" className={monst.className}>
        <body>
          <SignedOut>
            <SignInButton />
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
