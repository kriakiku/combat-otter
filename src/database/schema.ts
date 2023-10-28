import { HistoryType } from "@typed";
import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

/**
 * History
 */
export const history = sqliteTable('history', {
  id: integer('id').primaryKey(),
  type: text('type', { enum: [
    HistoryType["MW:level"],

    HistoryType["MW:rank"],
    HistoryType["MW:sr"],

    HistoryType["WZ:rank"],
    HistoryType["WZ:sr"],
  ] }),
  value: integer('value'),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`)
}, (self) => ({
  typeIdx: index('typeIdx').on(self.type)
}))
