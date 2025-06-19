import { Router } from 'express';
import { isAuthenticated, isAdmin, } from '../middlewares/auth.middleware';
import { PagoModelo } from '../models/PagoModelo';

const router = Router();
const modelo = new PagoModelo();

router.get('/payments', isAuthenticated, isAdmin, async (req, res) => {
  const pagos = await modelo.getAllPayments();
  res.render('payments', { pagos });
});

export default router;