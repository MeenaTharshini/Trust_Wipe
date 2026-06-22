import db from "./db.js";

export const initializeDatabase = () => {

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deviceName TEXT,
      serialNumber TEXT,
      storageType TEXT,
      capacity TEXT,
      location TEXT,
      status TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS wipejobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deviceId INTEGER,
      method TEXT,
      progress INTEGER,
      status TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      certificateId TEXT,
      deviceId INTEGER,
      pdfUrl TEXT
    )
  `);

  console.log("Tables Created");
};