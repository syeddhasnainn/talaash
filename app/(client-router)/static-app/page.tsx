'use client';
import NextDynamic from 'next/dynamic';

const App = NextDynamic(() => import('@/app/app'), {
  ssr: false,
});

export const dynamic = 'force-static';

export default function Home() {
  return <App />;
}
