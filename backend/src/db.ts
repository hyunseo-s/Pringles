import sqlite3 from "sqlite3";
import { open } from 'sqlite'

// Create or open the database
export const getDbConnection = async () => {
  const db = await open({
    filename: './chinook.db',
    driver: sqlite3.Database,
  });

  return db;
}