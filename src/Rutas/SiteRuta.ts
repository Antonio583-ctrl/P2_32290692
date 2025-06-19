
import { Router } from 'express';
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

router.get('/login', (req, res) => {
   res.render('login', { error: null, username: '' });
});

export default router;
