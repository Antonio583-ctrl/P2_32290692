import { Router } from 'express';
import { ContactosControlador } from '../Controlador/ContactosControlador';

const router = Router();
const controlador = new ContactosControlador();


router
  .route('/registro')
  .get((req, res) => {
    const isAdmin = req.session?.user?.role === 'admin';
    res.render('registro', {
      title: 'Formulario de Contacto - Vestiaire Royal',
      description: 'Contáctanos para reservar tu prenda de lujo o resolver tus dudas.',
      ogTitle: 'Formulario de Contacto - Vestiaire Royal',
      ogDescription: 'Contáctanos para reservar tu prenda de lujo o resolver tus dudas.',
      ogUrl: 'https://misitio.com/registro',
      ogImage: '/coleccion/men oufit 1.jpeg',
      showFooter: false,
      isAdmin
    });
  })
  .post(controlador.add.bind(controlador));

router.get('/contactos', controlador.index.bind(controlador));

export default router;
