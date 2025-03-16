import sqlite3 from "sqlite3";
import * as dotenv from "dotenv";

dotenv.config();

const DB_FILE = process.env.DB_FILE || "metadata.db";
const db = new sqlite3.Database(DB_FILE);

// Database initialization
db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS datasets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            cid TEXT UNIQUE,
            format TEXT,
            size INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

export function storeMetadata(
  name: string,
  cid: string,
  format: string,
  size: number
) {
  db.run(
    "INSERT INTO datasets (name, cid, format, size) VALUES (?, ?, ?, ?)",
    [name, cid, format, size],
    (err) => {
      if (err) {
        console.error("Error storing metadata:", err);
      } else {
        console.log("Metadata stored successfully.");
      }
    }
  );
}

// Example Usage
storeMetadata("dataset.csv", "Qm123abc", "CSV", 2048);
