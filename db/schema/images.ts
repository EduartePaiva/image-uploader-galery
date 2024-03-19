import { boolean, integer, pgEnum, pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core';


export const images = pgTable('images', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
    draft: boolean('draft').default(true)
});
