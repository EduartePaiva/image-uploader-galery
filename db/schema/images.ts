import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';


export const images = pgTable('images', {
    id: uuid('id').notNull().defaultRandom().primaryKey(),
    userId: varchar('user_id', { length: 256 }).notNull(),
    imageURL: varchar('image_url', { length: 256 }).notNull(),
    draft: boolean('draft').default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});
