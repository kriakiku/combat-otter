import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

/**
 * History
 */
export const history = sqliteTable('history', {
  id: integer('id').primaryKey(),
  type: text('type', { enum: [
    "MW:level",

    "MW:rank",
    "MW:sr",

    "WZ:rank",
    "WZ:sr",
  ] }),
  value: integer('value'),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`)
}, (self) => ({
  typeIdx: index('typeIdx').on(self.type)
}))
