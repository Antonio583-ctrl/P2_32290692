import express from 'express';
import session from 'express-session';
const SQLiteStore = require('connect-sqlite3')(session);
import ejsMate from 'ejs-mate';
import passport from 'passport';
import authRoutes from './auth/auth.routes';
import bodyParser from 'body-parser';
import { initializeDatabase } from './db/datos';

import cookieParser from 'cookie-parser';
import i18next, { TFunction } from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-express-middleware';
import fs from 'fs';
import path from 'path';
// import Toastify from 'toastify-js';

declare global {
  namespace Express {
    interface Request {
      t: TFunction;
      language: string;
    }
  }
}

import ContactosRuta from './Rutas/ContactosRuta';
import SiteRuta from './Rutas/SiteRuta';
import dotenv from 'dotenv';
import EnvRuta from './Rutas/EnvRuta';
import PagosAdminRuta from './Rutas/PagosAdminRuta';
import ContactosAdminRuta from './Rutas/ContactosAdminRuta';

dotenv.config();

import './auth/strategies/local.strategy';
import './auth/strategies/google.strategy';

const app = express();
const PORT = 3000;

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/translation.json')
    },
    initImmediate: false, // Carga sincrónica
    preload: ['es', 'en'],
    supportedLngs: ['es', 'en'],
    fallbackLng: 'es',
    nonExplicitSupportedLngs: true,
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: ['cookie'],
      lookupCookie: 'i18next',
      lookupQuerystring: 'lng',
      lookupHeader: 'accept-language'
    },
    interpolation: {
      escapeValue: false // Para permitir HTML en las traducciones
    },
    saveMissing: true, // En desarrollo para capturar keys faltantes
  });


app.use(cookieParser());

app.use((req, res, next) => {
  if (req.cookies.i18next && req.cookies.i18next.startsWith('es-')) {
    res.cookie('i18next', 'es', { maxAge: 365 * 24 * 60 * 60 * 1000 });
    req.cookies.i18next = 'es';
  }
  if (req.cookies.i18next && req.cookies.i18next.startsWith('en-')) {
    res.cookie('i18next', 'en', { maxAge: 365 * 24 * 60 * 60 * 1000 });
    req.cookies.i18next = 'en';
  }
  next();
});

app.use(i18nextMiddleware.handle(i18next));
// , {
//   ignoreRoutes: ['/public', '/assets'], // Ignora rutas estáticas
//   removeLngFromUrl: false // Mantiene el parámetro ?lng=en en URLs
// }));

// app.use((req, res, next) => {
//   console.log('Idioma detectado:', req.language);
//   console.log('Cookies:', req.cookies);
//   console.log('Traducciones disponibles:', i18next.services.backendConnector.backend);
//   next();
// });

// app.use((req, res, next) => {
//   console.log('Ruta de traducciones:', path.join(__dirname, '../locales'));
//   console.log('Archivos en locales/es:', fs.readdirSync(path.join(__dirname, '../locales/es')));
//   console.log('Contenido de en/translation.json:', require(path.join(__dirname, '../locales/en/translation.json')));
//   next();
// });

app.use('/node_modules/toastify-js', express.static(path.join(__dirname, '../node_modules/toastify-js')));

// pasar t y lang a todas las vistas
app.use((req, res, next) => {
  res.locals.t = req.t;
  res.locals.lang = req.language;

  res.locals.toastifyStyles = `
    <link rel="stylesheet" href="/node_modules/toastify-js/src/toastify.css">
    <style>
      .toastify {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        max-width: 80%;
        text-align: center;
        cursor: pointer;
      }
    </style>
  `;
  
  res.locals.toastifyScript = `
    <script src="/node_modules/toastify-js/src/toastify.js"></script>
    <script>
      window.showToast = function(message, backgroundColor = '#4CAF50') {
        // Limpiar toasts anteriores
        const oldToasts = document.querySelectorAll('.toastify');
        oldToasts.forEach(toast => toast.remove());
        
        const toast = Toastify({
          escapeMarkup: false,
          text: message,
          close: true,
          duration: 3000,
          gravity: "top",
          position: "center",
          style: {
            background: backgroundColor,
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '9999',
            maxWidth: '90%',
            width: 'auto',
            textAlign: 'left',
            borderRadius: '5px',
            color: '#fff',
            fontSize: '16px',
            padding: '15px 25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          },
          stopOnFocus: true,
          onClick: () => toast.hideToast()
        });

        // Añadir margen al botón de cerrar
        const closeBtn = document.createElement('style');
        closeBtn.innerHTML = \`
          .toast-close {
            color: white;
            font-size: 18px;
            margin-left: 15px;
            opacity: 0.8;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            align-self: flex-start;
          }
          .toast-close:hover {
            opacity: 1;
          }
        \`;
        document.head.appendChild(closeBtn);

        toast.showToast();

      }
    </script>
  `;
  next();
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Vista'));

app.use(session({
  store: new SQLiteStore({
    db: 'sessions.sqlite',
    dir: path.join(__dirname, 'db'),
  }),
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// 6. Middlewares de body y estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, 'Vista')));

// --- RUTAS ---
app.get('/api/auth/status', (req, res) => {
  res.json({ authenticated: !!req.session.user });
});

app.get('/api/recaptcha-key', (req, res) => {
  res.json({ siteKey: process.env.RECAPTCHA_SITE_KEY });
});

app.use('/api/auth', authRoutes);
app.use(PagosAdminRuta);
app.use(ContactosAdminRuta);
app.use('/api', EnvRuta);
app.use('/', SiteRuta);
app.use(ContactosRuta);

// --- INICIALIZACIÓN DE BASE DE DATOS Y SERVIDOR ---
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
