import { Router } from 'express';
import { ContactosControlador } from '../Controlador/ContactosControlador';

const router = Router();
const controlador = new ContactosControlador();


router.route('/registro')
  .get((req, res) => {
    const isAdmin = req.session?.user?.role === 'admin';
    res.render('registro', {
      title: req.t('meta.pages.register.title'),
      description: req.t('meta.pages.register.description'),
      ogTitle: req.t('meta.pages.register.ogTitle'),
      ogDescription: req.t('meta.pages.register.ogDescription'),
      ogUrl: req.t('meta.pages.register.ogUrl'),
      ogImage: req.t('meta.pages.register.ogImage'),
      showFooter: false,
      isAdmin
    });
  })
  .post(controlador.add.bind(controlador));

router.get('/contactos', controlador.index.bind(controlador));

export default router;
