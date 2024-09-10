import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const monst = Montserrat({ subsets: ["latin"], weight: "400" });
const jet = JetBrains_Mono({ subsets: ["latin"], weight: "400" });

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
    <ClerkProvider>
      <html lang="en" className={jet.className}>
        <body>
          <header>
            <SignedOut></SignedOut>
            <SignedIn></SignedIn>
            <main>{children}</main>
          </header>
        </body>
      </html>
    </ClerkProvider>
  );
}
