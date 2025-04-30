import { openDB } from 'idb';
import { Message } from '@/lib/types';
const DB_NAME = 'talaash';
const STORE_NAME = 'chats';
const DB_VERSION = 1;
export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: false,
        });
      }
    },
  });
  return db;
};

export const addMessage = async (
  chatId: string,
  message: Message,
  title?: string,
): Promise<void> => {
  const db = await initDB();
  const existing = await db.get(STORE_NAME, chatId);
  console.log('existing', existing);

  if (existing) {
    existing.messages.push(message);
    await db.put(STORE_NAME, existing);
  } else {
    await db.add(STORE_NAME, {
      id: chatId,
      messages: [message],
      title,
    });
  }
};

export const getAllChats = async () => {
  const db = await initDB();
  const items = await db.getAll(STORE_NAME);
  console.log('items', items);
  return items;
};

export const getChat = async (id: string) => {
  const db = await initDB();
  return db.get(STORE_NAME, id);
};

// export const deleteItem = async (id: string) => {
//   const db = await initDB();
//   await db.delete(STORE_NAME, id);
// };

export const deleteAllChats = async () => {
  const db = await initDB();
  await db.clear(STORE_NAME);
};
