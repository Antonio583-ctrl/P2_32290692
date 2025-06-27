
import { Router } from 'express';
import { PagoControlador } from '../Controlador/PagoControlador';
import path from 'path';

const router = Router();


router.get('/', (req, res) => {
  const isAdmin = req.session?.user?.role === 'admin';
  res.render('index', {
    title: 'Vestiaire Royal - Alquiler de Ropa de Lujo',
    description: 'Descubre la mejor selección de prendas exclusivas para tus eventos.',
    ogTitle: 'Vestiaire Royal - Alquiler de Ropa de Lujo',
    ogDescription: 'Descubre la mejor selección de prendas exclusivas para tus eventos.',
    ogUrl: 'https://misitio.com/',
    ogImage: '/coleccion/Maroon.jpeg',
    isAdmin
  });
});

router.get('/regist', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Vista', 'regist.html'));
});

router.get("/catalogo", (req, res) => {
  const isAdmin = req.session?.user?.role === 'admin';
  res.render('catalogo', { 
    title: 'Vestiaire Royal - Alquiler de Ropa de Lujo',
    description: 'Descubre la mejor selección de prendas exclusivas para tus eventos.',
    ogTitle: 'Vestiaire Royal - Alquiler de Ropa de Lujo',
    ogDescription: 'Descubre la mejor selección de prendas exclusivas para tus eventos.',
    ogUrl: 'https://misitio.com/',
    ogImage: '/coleccion/Maroon.jpeg',
    isAdmin
    
  });
});

router.get('/login', (req, res) => {
  const isAdmin = req.session?.user?.role === 'admin';
   res.render('login', { 
    error: null, 
    username: '',
    title: 'Vestiaire Royal - Alquiler de Ropa de Lujo',
    description: 'Descubre la mejor selección de prendas exclusivas para tus eventos.',
    ogTitle: 'Vestiaire Royal - Alquiler de Ropa de Lujo',
    ogDescription: 'Descubre la mejor selección de prendas exclusivas para tus eventos.',
    ogUrl: 'https://misitio.com/',
    ogImage: '/coleccion/Maroon.jpeg',
    showFooter: false,
    isAdmin
   });
});

const pagoCtrl = new PagoControlador();

router.route('/pago')
  .get((req, res) => {
    // Try to get services from localStorage (passed via query params)
    let servicios = [];
    if (req.query.servicios && typeof req.query.servicios === 'string') {
      try {
        servicios = JSON.parse(decodeURIComponent(req.query.servicios));
      } catch (e) {
        console.error('Error parsing servicios:', e);
      }
    }
    
    // Render the EJS template with services data
    const isAdmin = req.session?.user?.role === 'admin';
    res.render('confirmacion', {
      title: 'Vestiaire Royal - Alquiler de Ropa de Lujo',
      description: 'Descubre la mejor selección de prendas exclusivas para tus eventos.',
      ogTitle: 'Vestiaire Royal - Alquiler de Ropa de Lujo',
      ogDescription: 'Descubre la mejor selección de prendas exclusivas para tus eventos.',
      ogUrl: 'https://misitio.com/',
      ogImage: '/coleccion/Maroon.jpeg',
      isAdmin,
      servicios: servicios.length ? servicios : undefined,
    });
  })
  .post(pagoCtrl.add);

export default router;
