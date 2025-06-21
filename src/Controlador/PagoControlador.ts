import { Request, Response, NextFunction } from 'express';
import { PagoModelo } from '../Modelo/PagoModelo';


export class PagoControlador {
  private model = new PagoModelo();

  add: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req, res, next): Promise<void> => {
      try {
        const {
          correo,
          titular_tarjeta,
          numero_tarjeta,
          mes_expiracion,
          año_expiracion,
          cvv,
          monto,
          moneda,
        } = req.body;

        if (
          !correo ||
          !titular_tarjeta ||
          !numero_tarjeta ||
          !mes_expiracion ||
          !año_expiracion ||
          !cvv ||
          !monto ||
          !moneda
        ) {
          res.status(400).send('Todos los campos son obligatorios');
          return;
        }

        const montoNum = Number(monto);
        if (Number.isNaN(montoNum) || montoNum <= 0) {
          res.status(400).send('Monto incorrecto');
          return;
        }

        console.log("TOKEN:", process.env.FAKEPAYMENT_API_KEY);

        const apiResponse = await fetch("https://fakepayment.onrender.com/payments", {

          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.FAKEPAYMENT_API_KEy}`
          },
          body: JSON.stringify({
            amount: montoNum.toString(),
            "card-number": numero_tarjeta,
            cvv,
            "expiration-month": mes_expiracion,
            "expiration-year": año_expiracion,
            "full-name": titular_tarjeta,
            currency: moneda,
            description: "Pago desde formulario",
            reference: `correo:${correo}`
          })
        });

        if (!apiResponse.ok) {
          const texto = await apiResponse.text();
          console.error("❌ Error inesperado de la API:", texto);
          res.status(400).send("<h1>Error al procesar el pago</h1>");
          return;
        }

        const resultado = await apiResponse.json();

        if (!resultado.success) {
          console.error("❌ Pago rechazado:", resultado);
          res.status(400).send(`<h1>Pago rechazado</h1>`);
          return;
        }


        await this.model.addPayment(
          correo,
          titular_tarjeta,
          numero_tarjeta,
          mes_expiracion,
          año_expiracion,
          cvv,
          montoNum,
          moneda
        );

        res.status(201).send('<h1>Pago realizado</h1>');
      } catch (err) {
        next(err);
      }
    };
}
