import { Request, Response, NextFunction } from 'express';
import { PagoModelo } from '../models/PagoModelo';


export class PagoControlador {
  private model = new PagoModelo();
  add = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // add: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    // async (req, res, next): Promise<void> => {
      try {

        const t = req.t;

        const {
          correo,
          titular_tarjeta,
          numero_tarjeta: numero_tarjeta_raw,
          mes_expiracion,
          año_expiracion,
          cvv,
          monto,
          moneda,
          servicios
        } = req.body;

        if (!correo || !titular_tarjeta || !numero_tarjeta_raw || !mes_expiracion || 
            !año_expiracion || !cvv || !monto || !moneda) {
          // res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
          res.status(400).json({ 
            success: false, 
            message: t('pago.error.missingFields') 
          });
          return;
        }

        const montoNum = Number(monto);
        if (Number.isNaN(montoNum) || montoNum <= 0) {
          // res.status(400).json({ success: false, message: 'Monto incorrecto' });
          res.status(400).json({ 
            success: false, 
            message: t('pago.error.invalidAmount') 
          });
          return;
        }


        const numero_tarjeta = numero_tarjeta_raw.replace(/\D/g, "");

        // Procesar servicios para almacenamiento
        let serviciosText = 'Sin servicios especificados';
        try {
          if (servicios && typeof servicios === 'string') {
            const serviciosArray = JSON.parse(servicios);
            serviciosText = serviciosArray.map((s: any) => s.nombre).join(', ');
          }
        } catch (e) {
          console.error('Error parsing servicios:', e);
        }

        const apiResponse = await fetch("https://fakepayment.onrender.com/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.FAKEPAYMENT_API_KEY}`
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

        // Manejo de redirección (éxito)
        if (apiResponse.status === 302) {
          await this.model.addPayment(
            correo,
            titular_tarjeta,
            numero_tarjeta,
            mes_expiracion,
            año_expiracion,
            cvv,
            montoNum,
            moneda,
            serviciosText,
            'completado'
          );
          // res.status(201).json({ success: true, message: "Pago realizado correctamente" });
          res.status(201).json({ 
            success: true, 
            message: t('pago.success.paymentCompleted') 
          });
          return;
        }
        
        // Manejo de error de conexión
        if (!apiResponse.ok) {
          const texto = await apiResponse.text();
          console.error("Error en la API de pago:", texto);
          res.status(400).json({ 
            success: false, 
            message: t('pago.error.paymentProcessing') 
          });
          return;
        }
        
        // Manejo de respuesta JSON estándar
        const resultado = await apiResponse.json();

        if (!resultado.success) {
          console.error("Pago rechazado:", resultado);
          res.status(400).json({ 
            success: false, 
            message: resultado.message || t('pago.error.paymentRejected') 
          });
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
          serviciosText,
          'completado'
        );


        res.status(201).json({ 
          success: true, 
          message: t('pago.success.paymentCompleted') 
        });
        return;
      } catch (err) {
        console.error("Error en PagoControlador:", err);
        res.status(500).json({ 
          success: false, 
          message: req.t('pago.error.serverError') 
        });
    }
  };
}