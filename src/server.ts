import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Importa las rutas del servidor
import { router as root } from './routes/root.routes';
import { router as apiRoot } from './routes/api/api.routes';
import { router as apiFilm } from './routes/api/film/film.routes';
import { router as apiSearch } from './routes/api/search/search.routes';

export const app = express();

app.use(cors());
app.use(bodyParser.json());

// Asigna las rutas a la aplicación
app.use('/', root);
app.use('/api', apiRoot);
app.use('/api/film', apiFilm);
app.use('/api/search', apiSearch);
