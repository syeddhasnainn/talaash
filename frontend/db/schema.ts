import { relations } from "drizzle-orm";
import { integer, text, boolean, pgTable, uuid, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: text('id').primaryKey().notNull()
})

export const chats = pgTable("chats", {
    id: text("id").primaryKey().notNull(),
    user_id: text('user_id').notNull().references(()=>users.id)
})

export const messages = pgTable("messages", {
    role: text("role").notNull(),
    content: text("content").notNull(),
    chat_id: text("chat_id").notNull().references(() => chats.id),
    createdAt: timestamp('created_at').defaultNow().notNull()
});