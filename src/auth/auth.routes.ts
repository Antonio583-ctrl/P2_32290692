import { Router } from 'express';
import { login, logout, register } from './auth.controller';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware';
import passport from 'passport';

const router = Router();

router.post('/login', login);
router.post('/api/auth/login', login);
router.get('/logout', logout);
router.post('/register', isAuthenticated, isAdmin, register);

// Ruta para iniciar login con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

export default router;
