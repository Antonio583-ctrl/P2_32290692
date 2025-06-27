import { Request, Response, NextFunction } from 'express';



declare global {
  namespace Express {
    interface User {
      role: string;
      [key: string]: any;
    }
    interface Request {
      user?: User;
    }
  }
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session.user) {
    res.status(403).render('error-permiso');
    return;
  }
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session.user?.role !== 'admin') {
    res.status(403).render('error-permiso');
    return;
  }
  next();
};