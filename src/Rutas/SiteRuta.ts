
import { Router } from 'express';
import { PagoControlador } from '../Controlador/PagoControlador';
import path from 'path';

const router = Router();


router.get('/', (req, res) => {
  const isAdmin = req.session?.user?.role === 'admin';
  res.render('index', {
    title: req.t('meta.pages.home.title'),
    description: req.t('meta.description'),
    ogTitle: req.t('meta.og.title'),
    ogDescription: req.t('meta.og.description'),
    ogUrl: req.t('meta.og.url'),
    ogImage: req.t('meta.og.image'),
    isAdmin
  });
});

router.get("/catalogo", (req, res) => {
  const isAdmin = req.session?.user?.role === 'admin';
  res.render('catalogo', { 
    title: req.t('meta.pages.catalog.title'),
    description: req.t('meta.description'),
    ogTitle: req.t('meta.og.title'),
    ogDescription: req.t('meta.og.description'),
    ogUrl: req.t('meta.og.url'),
    ogImage: req.t('meta.og.image'),
    isAdmin
  });
});

router.get('/login', (req, res) => {
  const isAdmin = req.session?.user?.role === 'admin';
  res.render('login', { 
    error: null, 
    username: '',
    title: req.t('meta.pages.login.title'),
    description: req.t('meta.description'),
    ogTitle: req.t('meta.og.title'),
    ogDescription: req.t('meta.og.description'),
    ogUrl: req.t('meta.og.url'),
    ogImage: req.t('meta.og.image'),
    showFooter: false,
    isAdmin
  });
});

const pagoCtrl = new PagoControlador();

router.route('/pago')
  .get((req, res) => {
    let servicios = [];
    if (req.query.servicios && typeof req.query.servicios === 'string') {
      try {
        servicios = JSON.parse(decodeURIComponent(req.query.servicios));
      } catch (e) {
        console.error('Error parsing servicios:', e);
      }
    }
    
    const isAdmin = req.session?.user?.role === 'admin';
    res.render('confirmacion', {
      title: req.t('meta.pages.payment.title'),
      description: req.t('meta.description'),
      ogTitle: req.t('meta.og.title'),
      ogDescription: req.t('meta.og.description'),
      ogUrl: req.t('meta.og.url'),
      ogImage: req.t('meta.og.image'),
      isAdmin,
      servicios: servicios.length ? servicios : undefined,
    });
  }) .post(pagoCtrl.add);


router.get('/regist', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Vista', 'regist.html'));
});


export default router;
