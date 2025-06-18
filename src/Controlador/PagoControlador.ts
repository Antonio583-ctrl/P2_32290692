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
