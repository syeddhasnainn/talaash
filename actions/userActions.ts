
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

export const addUser = async (userId: string, name: string, email: string) => {
    await db.insert(users).values({
        userId,
        name,
        email,
    })
}