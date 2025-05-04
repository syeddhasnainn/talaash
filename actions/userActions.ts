
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const addUser = async (userId: string, name: string, email: string) => {
    await db.insert(users).values({
        userId,
        name,
        email,
    })
}

export const getUser = async (userId: string) => {
    const user = (await db.select().from(users)).find((user) => user.userId === userId);
    return user;
}