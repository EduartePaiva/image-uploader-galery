import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { env } from "./env/server";

config();

export default defineConfig({
    schema: "./db/schema",
    dialect: "postgresql",
    out: "./db/drizzle",
    dbCredentials: {
        url: env.DATABASE_URL,
    }
});
