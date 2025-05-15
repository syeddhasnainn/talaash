'use client';
import { BrowserRouter, Routes, Route, Link } from 'react-router';
import ChatPage from '@/app/chat/page';
import ChatLayout from './chat/layout';
import ChatIdPage from '@/app/chat/[id]/page';
export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<ChatLayout />}>
            <Route path="/"  element={<ChatPage />} />
            <Route path="/chat/:id" element={<ChatIdPage />} />
          </Route>
        </Routes>
    </BrowserRouter>
  );
}
