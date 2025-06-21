import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { ContactosModelo } from '../Modelo/ContactosModelo';
import { verificarCaptcha } from '../Servicio/captcha';
import { enviarNotificacion } from '../Servicio/notificacionEmail';


export class ContactosControlador {
  private model = new ContactosModelo();

  async add(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {


      
      const captchaToken = req.body["g-recaptcha"];

      const captchaValido = await verificarCaptcha(captchaToken);
      if (!captchaValido) {
        res.status(403).send("Verificación reCAPTCHA fallida");
        return;
      }

      const fecha = new Date().toISOString();
      const { correo, nombre, comentario } = req.body;
      if (!correo || !nombre || !comentario) {
        res.status(400).send('Todos los campos son obligatorios');
        return;
      }

      let ip = 'ip no disponible';
      let pais = 'no disponible';

      try {
        const respuesta = await fetch("http://ip-api.com/json/");
        const data = await respuesta.json();

        if (data.status === 'success') {
          ip = data.query || ip;
          pais = data.country || pais;
        } else {
          console.error("ip-api falló:", data);
        }
      } catch (geoErr) {
        console.error("Error al consultar ip-api:", geoErr);
      }

      console.log("Insertando →", { correo, nombre, comentario, ip, pais });

      await this.model.addContact(correo, nombre, comentario, ip, pais);
      await enviarNotificacion({nombre,correo,comentario,ip,pais,fecha});
      res.sendFile(path.join(__dirname, '..', 'Vista', 'confirmacion.html'));
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
          <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Comentario</th><th>IP</th><th>País</th><th>Fecha</th></tr>
          ${contactos.map((c: any) => `
            <tr>
              <td>${c.id}</td><td>${c.nombre}</td><td>${c.correo}</td>
              <td>${c.comentario}</td><td>${c.ip}</td><td>${c.pais}</td><td>${c.creado_en}</td>
            </tr>`).join('')}
        </table>`;
      res.send(html);
    } catch (err) {
      next(err);
    }
  }
}
