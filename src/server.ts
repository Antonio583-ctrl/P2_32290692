import express from 'express';
import bodyParser from 'body-parser';
import { initializeDatabase } from './db/datos';
import ContactosRuta from './Rutas/ContactosRuta';
import PagoRutas from './Rutas/PagoRutas';
import SiteRuta from './Rutas/SiteRuta';
import dotenv from 'dotenv';
import path from 'path';
import EnvRuta from './Rutas/EnvRuta';




dotenv.config();
const app = express();
const PORT = 3000;


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


