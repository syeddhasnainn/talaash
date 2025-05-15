'use client';
import { BrowserRouter, Routes, Route } from 'react-router';
import ChatPage from '@/app/chat-page';
import ChatLayout from './chat-layout';
import ChatIdPage from '@/app/chatid-page';
export default function App() {
  if (typeof window !== 'undefined') {
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
  return null;
}
