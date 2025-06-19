import { Request, Response } from 'express';
import authService from './auth.service';


// Extiende la interfaz SessionData para incluir 'user'
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: any;
  }
}


export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await authService.login(username, password);
    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'credenciales incorrectas';
    res.status(401).render('login', {
      error: message,
      username: req.body.username || ''
    });
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    await authService.register(userData);
    res.status(201).json({ success: true, message: 'Usuario registrado correctamente' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ success: false, message });
  }
};