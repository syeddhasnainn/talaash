import { drizzle } from 'drizzle-orm/node-postgres';
import { seed } from 'drizzle-seed';
// import { users, chats, messages } from './schema';
import * as schema from './schema';

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  // await reset(db, schema);
  await seed(db, schema).refine(()=> ({
    users: {
      count: 1,      
    },
    chats: {
      count: 1,
    },
    messages: {
      count: 10,
    },
  }));
}
main();
