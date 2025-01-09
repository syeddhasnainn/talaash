"use server";
import db from "@/db/drizzle";
import { chats, messages, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getUser = async (id: string) => {
  const user = await db.select().from(users).where(eq(users.id, id));
  return user;
};

export const createUser = async (id: string) => {
  await db.insert(users).values({
    id: id,
  });
  revalidatePath("/");
};

export const createChat = async (
  user_id: string,
  id: string,
  chat_name: string,
) => {
  await db.insert(chats).values({
    user_id: user_id,
    id: id,
    chat_name: chat_name,
  });
  revalidatePath("/");
};

export const getChats = async (id: string) => {
  const data = await db.select().from(chats).where(eq(chats.user_id, id));
  return data;
};

export const addMessage = async (
  role: string,
  content: string,
  chat_id: string,
) => {
  await db.insert(messages).values({
    role: role,
    content: content,
    chat_id: chat_id,
  });
  revalidatePath("/");
};

export const getMessages = async (chat_id: string) => {
  const data = await db
    .select()
    .from(messages)
    .where(eq(messages.chat_id, chat_id));
  return data;
};

export const deleteChats = async (chat_id: string) => {
  await db.delete(chats).where(eq(chats.id, chat_id));
};


export const incrementMessages = async (user_id:string)=> {
  await db
  .update(users)
  .set({message_count: sql`${users.message_count} + 1`})
  .where(eq(users.id, user_id))
}

export const getMessageCount = async (user_id:string) => {
  const result = await db
    .select({ count: users.message_count })
    .from(users)
    .where(eq(users.id, user_id))
  
  return result[0].count;
}