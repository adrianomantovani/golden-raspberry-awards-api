import Database from 'better-sqlite3';

const db = new Database(':memory:');

db.exec(`
  CREATE TABLE movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    studios TEXT NOT NULL,
    producers TEXT NOT NULL,
    winner BOOLEAN NOT NULL
  );
`);
console.log('Created table movies successfully');

export default db;
