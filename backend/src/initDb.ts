import { getDbConnection } from "./db";

export const initDB = async () => {
  const db = await getDbConnection();

	// Drop all existing tables
  await db.exec(`
    DROP TABLE IF EXISTS users;
    -- Add additional DROP statements for other tables here if needed
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL
    )
  `);

  return db;
}

