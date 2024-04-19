import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"

declare global {
    var db: NodePgDatabase<Record<string, never>> | undefined
}

const db =
    globalThis.db ||
    drizzle(
        new Pool({
            connectionString: process.env.DATABASE_URL,
        }),
    )

if (process.env.NODE_ENV !== "production") globalThis.db = db

export default db
