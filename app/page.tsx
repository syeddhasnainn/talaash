"use client";
import { RedirectToSignIn } from "@clerk/nextjs";
import { useSocket } from "./socket";

export default function Home() {
  const socket = useSocket();

  return (
    <main>
      <RedirectToSignIn />
    </main>
  );
}
