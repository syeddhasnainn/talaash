"use client";
import { useSocket } from "./socket";

export default function Home() {
  const socket = useSocket();

  return (
    <main>
      <div>hi there! noob.</div>
    </main>
  );
}
