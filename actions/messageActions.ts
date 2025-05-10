'use server';
import { eq } from 'drizzle-orm';
// import { revalidatePath } from 'next/cache';
import { db } from '@/db/drizzle';
import { messages } from '@/db/schema';

export const addMessage = async (
  userId: string,
  chatId: string,
  role: string,
  content: string,
) => {
  await db.insert(messages).values({
    userId,
    chatId,
    role,
    content,
  });
};

export const getMessages = async (chatId: string) => {
  const data = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId));
  return data;
};
