import express from 'express';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import ejsMate from 'ejs-mate';
import passport from 'passport';
import authRoutes from './auth/auth.routes';
import bodyParser from 'body-parser';
import { initializeDatabase } from './db/datos';
import cookieParser from 'cookie-parser';

import ContactosRuta from './Rutas/ContactosRuta';
import PagoRutas from './Rutas/PagoRutas';
import SiteRuta from './Rutas/SiteRuta';
import dotenv from 'dotenv';
import path from 'path';
import EnvRuta from './Rutas/EnvRuta';
import PagosAdminRuta from './Rutas/PagosAdminRuta';
import ContactosAdminRuta from './Rutas/ContactosAdminRuta';


dotenv.config();

import './auth/strategies/local.strategy';
import './auth/strategies/google.strategy';


dotenv.config();
const app = express();
const PORT = 3000;

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Vista'));

// task-4 punto 4
app.use(session({
  store: new (SQLiteStore(session))({
    db: 'sessions.sqlite',
    dir: path.join(__dirname, 'db'),
  }),
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax', // Puedes usar 'strict' si tu app no usa subdominios
    secure: process.env.NODE_ENV === 'production', // Solo true en producción con HTTPS
    maxAge: 15 * 60 * 1000 // tiempo expresado en milisegundos (15 minutos)
  }
}));

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());


app.get('/api/auth/status', (req, res) => {
  res.json({ authenticated: !!req.session.user });
});
// Rutas
app.use('/api/auth', authRoutes);

app.use(PagosAdminRuta);
app.use(ContactosAdminRuta);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, 'Vista')));
app.use('/api', EnvRuta);


app.use('/', SiteRuta);    

app.use(ContactosRuta);
app.use(PagoRutas);

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});


