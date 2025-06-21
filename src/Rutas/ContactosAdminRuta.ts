import { Router } from 'express';
import { isAuthenticated, isAdmin,} from '../middlewares/auth.middleware';
import { ContactosModelo } from '../models/ContactosModelo';
import { formatFecha } from '../utils/formatFecha';

const router = Router();
const modelo = new ContactosModelo();

router.get('/contacts', isAuthenticated, isAdmin, async (req, res) => {
  const contactos = await modelo.getAllContacts();
  res.render('contacts', { contactos, formatFecha, title: 'Contactos - Administración' });
});

export default router;
