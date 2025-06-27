import { Router } from 'express';
import { isAuthenticated, isAdmin, } from '../middlewares/auth.middleware';
import { PagoModelo } from '../models/PagoModelo';
// import { formatFecha } from '../utils/formatFecha';
import { formatFecha } from '../helpers/formatFecha';
import { formatMoneda } from '../helpers/formatMoneda';

const router = Router();
const modelo = new PagoModelo();

router.get('/payments', isAuthenticated, isAdmin, async (req, res) => {
  const pagos = await modelo.getAllPayments();
  res.render('payments', { pagos, 
    // formatFecha, 
    formatFecha: (d: any) => formatFecha(d, req.language),
    formatMoneda: (m: any) => formatMoneda(m, req.language),
    title: 'Pagos - Administración' });
});

export default router;