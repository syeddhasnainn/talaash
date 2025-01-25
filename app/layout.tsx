import { ChatProvider } from "@/context/ChatContext";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talaash",
  description: "Local only AI chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        <ChatProvider>
          {children}
          <Analytics />
        </ChatProvider>
      </body>
    </html>
  );
}
