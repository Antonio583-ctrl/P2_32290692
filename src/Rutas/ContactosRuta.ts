
import { Router } from 'express';
import { ContactosControlador } from '../Controlador/ContactosControlador';
import path from 'path';

const router = Router();
const controlador = new ContactosControlador();


router
  .route('/registro')

  .get((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Vista', 'registro.html'));
  })

  .post(controlador.add.bind(controlador));


router.get('/contactos', controlador.index.bind(controlador));

export default router;
