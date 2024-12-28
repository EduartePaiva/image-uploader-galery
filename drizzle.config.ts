import { config } from "dotenv"
import { defineConfig } from "drizzle-kit";

config()

export default defineConfig({
    schema: "./db/schema",
    dialect: "postgresql",
    out: "./db/drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    }
})
