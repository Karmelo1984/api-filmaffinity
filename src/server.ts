import express from 'express';
import cors from 'cors';

// Crea una instancia de la aplicación 'express'
export const app = express();

// Habilita el uso de 'CORS' en la aplicación
app.use(cors());

// Habilita el uso de JSON en la aplicación para procesar datos en formato JSON en las solicitudes y respuestas.
app.use(express.json());

// Importa las rutas del servidor
import { router as root } from './routes/routes.root';
import { router as apiRoot } from './routes/api/routes.api';
import { router as apiFilm } from './routes/api/film/routes.film';
import { router as apiSearch } from './routes/api/search/routes.search';

// Asigna las rutas a la aplicación
app.use('/', root);
app.use('/api', apiRoot);
app.use('/api/film', apiFilm);
app.use('/api/search', apiSearch);
