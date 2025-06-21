import { getDBConnection } from '../db/datos';

export class PagoModelo {
  async addPayment(
    correo: string,
    titular_tarjeta: string,
    numero_tarjeta: string,
    mes_expiracion: string,
    año_expiracion: string,
    cvv: string,
    monto: number,
    moneda: string
  ) {
    const db = await getDBConnection();
    const creado_en = new Date().toISOString();
    await db.run(
      `INSERT INTO pagos (correo, titular_tarjeta, numero_tarjeta, mes_expiracion, año_expiracion, cvv, monto, moneda, creado_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [correo, titular_tarjeta, numero_tarjeta, mes_expiracion, año_expiracion, cvv, monto, moneda, creado_en]
    );
    await db.close();
  }
}
