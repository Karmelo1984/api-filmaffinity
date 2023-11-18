import express from 'express';
export const app = express();

import cors from 'cors';

app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Importa las rutas del servidor
import { router as root } from './routes/routes.root';
import { router as apiRoot } from './routes/api/routes.api';
import { router as apiFilm } from './routes/api/film/film.routes';
import { router as apiSearch } from './routes/api/search/search.routes';

// Asigna las rutas a la aplicación
app.use('/', root);
app.use('/api', apiRoot);
app.use('/api/film', apiFilm);
app.use('/api/search', apiSearch);
