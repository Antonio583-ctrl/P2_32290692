import { DefaultDeserializer } from 'v8';
import { getDBConnection } from '../db/datos';

export class ContactosModelo {
  async addContact(correo: string, nombre: string, comentario: string, ip: string, pais:string,) {
    const db = await getDBConnection();
    const creado_en = new Date().toISOString();
    await db.run(
      `INSERT INTO contactos (correo, nombre, comentario, ip, pais, creado_en) VALUES (?, ?, ?, ?, ?, ?)`,
      [correo, nombre, comentario, ip,pais, creado_en]
    );
  
    await db.close();
    
  }

  async getAllContacts() {
    const db = await getDBConnection();
    const contacts = await db.all(`SELECT * FROM contactos ORDER BY creado_en DESC`);
    await db.close();
    return contacts;
  }
}




