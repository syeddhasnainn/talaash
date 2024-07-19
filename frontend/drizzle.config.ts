import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: '.env.local' })

export default defineConfig({
    schema: "./db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.NEON_DATABASE_URL!,
    },
});