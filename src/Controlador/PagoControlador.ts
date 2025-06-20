import { Request, Response, NextFunction } from 'express';
import { PagoModelo } from '../models/PagoModelo';


export class PagoControlador {
  private model = new PagoModelo();

  add: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req, res, next): Promise<void> => {
      try {
        const {
          correo,
          titular_tarjeta,
          numero_tarjeta: numero_tarjeta_raw,
          mes_expiracion,
          año_expiracion,
          cvv,
          monto,
          moneda,
        } = req.body;

        if (
          !correo ||
          !titular_tarjeta ||
          !numero_tarjeta_raw ||
          !mes_expiracion ||
          !año_expiracion ||
          !cvv ||
          !monto ||
          !moneda
        ) {
          res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
          return;
        }

        const montoNum = Number(monto);
        if (Number.isNaN(montoNum) || montoNum <= 0) {
          res.status(400).json({ success: false, message: 'Monto incorrecto' });
          return;
        }

        // console.log("TOKEN:", process.env.FAKEPAYMENT_API_KEY);

        const numero_tarjeta = numero_tarjeta_raw.replace(/\D/g, "");

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
          }),
          redirect: "manual"
        });

        console.log("apiResponse.status:", apiResponse.status);
        const apiText = await apiResponse.text();
        console.log("apiResponse.text():", apiText);
        // const resultado = await apiResponse.json();

        const resultado = await apiResponse.json();
        console.log("Resultado", resultado);
        

        // Manejo de redirección (éxito)
        if (apiResponse.status === 302) {
          console.log("✅ Pago exitoso (redirección 302)");
          await this.model.addPayment(
            correo,
            titular_tarjeta,
            numero_tarjeta,
            mes_expiracion,
            año_expiracion,
            cvv,
            montoNum,
            moneda,
            req.body.servicio || 'Sin especificar',
            'completado'
          );
          res.status(201).json({ success: true, message: "Pago realizado correctamente" });
          return;
        }
        
        // Manejo de error de conexión
        if (!apiResponse.ok) {
          const texto = await apiResponse.text();
          console.error("❌ Error inesperado de la API:", texto);
          res.status(400).json({ success: false, message: "Error al procesar el pago" });
          return;
        }
        
        // Manejo de respuesta JSON estándar
        

        if (!resultado.success) {
          console.error("❌ Pago rechazado:", resultado);
          res.status(400).json({ success: false, message: resultado.message || "Pago rechazado" });
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
          moneda,
          req.body.servicio || 'Sin especificar',
          'completado'
        );

        res.status(201).json({ success: true, message: "Pago realizado correctamente" });
      } catch (err) {
        console.error("❌ Error general en PagoControlador:", err);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
      }
    };
}
