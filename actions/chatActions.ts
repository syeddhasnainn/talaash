'use server';
import { eq } from 'drizzle-orm';
// import { revalidatePath } from 'next/cache';
import { db } from '@/db/drizzle';
import { chats } from '@/db/schema';
export const getData = async () => {
  const data = await db.select().from(chats);
  return data;
};
export const addChat = async (id: string, userId: string, title: string) => {
  await db.insert(chats).values({
    id, // uuid
    userId,
    title,
  });
};

export const getChat = async (id: string) => {
  const data = await db.select().from(chats).where(eq(chats.id, id));
  return data;
};

export const getAllChats = async () => {
  const data = await db.select().from(chats);
  return data;
};

export const getChatById = async (id: string) => {
  const data = await db.select().from(chats).where(eq(chats.id, id));
  return data;
};
