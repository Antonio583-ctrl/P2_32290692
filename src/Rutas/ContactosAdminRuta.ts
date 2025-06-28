import { Router } from 'express';
import { isAuthenticated, isAdmin,} from '../middlewares/auth.middleware';
import { ContactosModelo } from '../models/ContactosModelo';
// import { formatFecha } from '../utils/formatFecha';
import { formatFecha } from '../helpers/formatFecha';
import { formatMoneda } from '../helpers/formatMoneda';

const router = Router();
const modelo = new ContactosModelo();

router.get('/contacts', isAuthenticated, isAdmin, async (req, res) => {
  const contactos = await modelo.getAllContacts();
  res.render('contacts', { contactos, 
    // formatFecha,
    formatFecha: (d: any) => formatFecha(d, req.language),
    formatMoneda: (m: any) => formatMoneda(m, req.language),
    title: req.t('admin.contacts.titlePage') });
});

export default router;
