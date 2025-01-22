import { openDB } from "idb";
import { ChatType } from "@/types/types";
const DB_NAME = "talaash";
const STORE_NAME = "chats";

export const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, {
        autoIncrement: true,
      });
    },
  });
  return db;
};

export const addItem = async (item: ChatType, key: string) => {
  const db = await initDB();
  const existingItem = await db.get(STORE_NAME, key);
  console.log("existing item", existingItem);
  if (existingItem) {
    await db.put(STORE_NAME, item, key);
  } else {
    await db.add(STORE_NAME, item, key);
  }
};

export const getAllItems = async () => {
  const db = await initDB();
  const items = await db.getAll(STORE_NAME);
  return items;
};

export const getChat = async (id: string) => {
  const db = await initDB();
  const chat = await db.get(STORE_NAME, id);
  return chat;
};

export const deleteItem = async (id: string) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

export const deleteAllItems = async () => {
  const db = await initDB();
  await db.clear(STORE_NAME);
};
