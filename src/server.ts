import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Importa las rutas del servidor
import { router as root } from './routes/root.routes';
import { router as apiRoot } from './routes/api/api.routes';
import { router as apiFilm } from './routes/api/film/film.routes';
import { router as apiSearch } from './routes/api/search/search.routes';

export const app = express();

// Contador de peticiones request que ha tenido la aplicación
import { requestCounterMiddleware } from './middleware/processRequest';
app.use(requestCounterMiddleware);

// Responde a solicitudes de diferentes orígenes
app.use(cors());

// Analiza el cuerpo de la solicitud y convierte el JSON en un objeto JavaScript
app.use(bodyParser.json());

// Asigna las rutas a la aplicación
app.use('/', root);
app.use('/api', apiRoot);
app.use('/api/film', apiFilm);
app.use('/api/search', apiSearch);
