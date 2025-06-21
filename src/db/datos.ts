import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getDBConnection() {
  return open({
    filename: './src/db/datos.sqlite',
    driver: sqlite3.Database
  });
}

export async function initializeDatabase() {
  const db = await getDBConnection();
            
  await db.exec(`
    CREATE TABLE IF NOT EXISTS contactos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      correo TEXT,
      nombre TEXT,
      comentario TEXT,
      pais TEXT,  
      ip TEXT,
      creado_en TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS pagos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      correo TEXT,
      titular_tarjeta TEXT,
      numero_tarjeta TEXT,
      mes_expiracion TEXT,
      año_expiracion TEXT,
      cvv TEXT,
      monto REAL,
      moneda TEXT,
      creado_en TEXT
    );
  `);
  
  await db.close();
}
