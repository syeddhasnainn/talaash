'use server';
import { desc, eq } from 'drizzle-orm';
// import { revalidatePath } from 'next/cache';
import { db } from '@/db/drizzle';
import { chats } from '@/db/schema';
export const getData = async () => {
  const data = await db.select().from(chats);
  return data;
};
export const addChat = async (id: string, userId: string, title: string) => {
  try {
    await db.insert(chats).values({
      id, // uuid
      userId,
      title,
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding chat:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
};

export const getChat = async (id: string) => {
  const data = await db.select().from(chats).where(eq(chats.id, id));
  return data;
};

export const deleteAllChats = async (userId: string) => {
  await db.delete(chats).where(eq(chats.userId, userId));
};

export const fetchUserChats = async (userId: string) => {
  const data = await db.select().from(chats).where(eq(chats.userId, userId)).orderBy(desc(chats.createdAt));
  console.log('data from db',data);
  return data;
};

export const getChatById = async (id: string) => {
  const data = await db.select().from(chats).where(eq(chats.id, id));
  return data;
};
