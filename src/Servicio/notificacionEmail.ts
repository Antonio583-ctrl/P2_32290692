import nodemailer from 'nodemailer';

interface ContactoData {
  nombre: string;
  correo: string;
  comentario: string;
  ip: string;
  pais: string;
  fecha: string;
}

export async function enviarNotificacion(data: ContactoData) {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    NOTIFY_EMAILS
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !NOTIFY_EMAILS) {
    console.error("❌ Faltan variables de entorno para enviar correo.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  const html = `
    <h2>Nuevo contacto recibido</h2>
    <p><strong>Nombre:</strong> ${data.nombre}</p>
    <p><strong>Correo:</strong> ${data.correo}</p>
    <p><strong>Comentario:</strong> ${data.comentario}</p>
    <p><strong>Dirección IP:</strong> ${data.ip}</p>
    <p><strong>País:</strong> ${data.pais}</p>
    <p><strong>Fecha/Hora:</strong> ${data.fecha}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Formulario RicardoRDC" <${SMTP_USER}>`,
      to: NOTIFY_EMAILS,
      subject: "📩 Nuevo mensaje desde el formulario de contacto",
      html
    });

    console.log("✅ Notificación enviada correctamente.");
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
  }
}
