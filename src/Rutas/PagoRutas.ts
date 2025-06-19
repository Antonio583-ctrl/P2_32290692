
import { Router } from 'express';
import { PagoControlador } from '../Controlador/PagoControlador';
import path from 'path';

const router = Router();
const pagoCtrl = new PagoControlador();


router.route('/pago')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Vista', 'confirmacion.html'));
  })
  .post(pagoCtrl.add);

export default router;
