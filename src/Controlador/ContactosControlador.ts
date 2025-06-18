import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { ContactosModelo } from '../Modelo/ContactosModelo';   

export class ContactosControlador {
  private model = new ContactosModelo();


  async add(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { correo, nombre, comentario } = req.body;
      const ip = req.ip ?? 'ip no disponible';

      if (!correo || !nombre || !comentario) {
        res.status(400).send('Todos los campos son obligatorios');
        return;              
      }

      await this.model.addContact(correo, nombre, comentario, ip);

      res.sendFile(
        path.join(__dirname, '..', 'Vista', 'confirmacion.html')
      );
   
    } catch (err) {
      next(err);               
    }
  }

  async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contactos = await this.model.getAllContacts();

      const html = `
        <h1>Contactos Registrados</h1>
        <table border="1">
          <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Comentario</th><th>IP</th><th>Fecha</th></tr>
          ${contactos.map((c: any) => `
            <tr>
              <td>${c.id}</td><td>${c.nombre}</td><td>${c.correo}</td>
              <td>${c.comentario}</td><td>${c.ip}</td><td>${c.creado_en}</td>
            </tr>`).join('')}
        </table>`;
      res.send(html);
    } catch (err) {
      next(err);
    }
  }
}
