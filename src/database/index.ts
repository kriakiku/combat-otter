import { join, resolve } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'
import { app } from 'electron';
import Database from 'better-sqlite3';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

const DATABASE_PATH = join(app.getPath('userData'), 'database.db');

const sqlite = new Database(DATABASE_PATH);
const db: BetterSQLite3Database = drizzle(sqlite);

/**
 * Migrations
 */
export const runDatabase = async () => {
    /** Production mode */
    if (app.isPackaged) {
        await migrate(db, { migrationsFolder: resolve(process.resourcesPath, 'migrations') });
        return
    }

    /** Development mode */
    else {
        // Config
        const configPath = resolve('./drizzle.config.json');
        const config = JSON.parse(readFileSync(configPath).toString());
        
        if (config.dbCredentials.url !== DATABASE_PATH) {
            config.dbCredentials.url = DATABASE_PATH
            writeFileSync(configPath, JSON.stringify(
                config, null, 2
            ))
        }

        // Migrate
        await migrate(db, { migrationsFolder: config.out });
    }
}