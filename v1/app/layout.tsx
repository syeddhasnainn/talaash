import type { Metadata } from "next";
import { Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ChatProvider } from "@/components/chat-provider";


const monst = Montserrat({ subsets: ["latin"], weight: "400" });
const jet = JetBrains_Mono({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Talaash",
  description: "AI Chat App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={monst.className}>
    <ChatProvider>

      <body>
        <header>
          <main>
            {children}
          </main>
        </header>
      </body>
      </ChatProvider>
    </html>
  );
}
