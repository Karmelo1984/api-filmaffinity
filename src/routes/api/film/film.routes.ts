import express from 'express';
import { processRequest } from '../../../middleware/processRequest';
import { getFilmController, postFilmController } from '../../../controllers/api/film/film.controller';

export { router };
const router = express.Router();

/**
 * Ruta para obtener información sobre una película mediante una solicitud GET.
 *
 * @name GET /api/film
 * @memberof module:FilmRouter
 *
 * @param {Function} processRequest       - Middleware para procesar la solicitud.
 * @param {Function} getFilmController    - Controlador para la solicitud GET de información sobre una película.
 */
router.get('/', processRequest, getFilmController);

/**
 * Ruta para obtener información sobre una película mediante una solicitud POST.
 *
 * @name POST /api/film
 * @memberof module:FilmRouter
 *
 * @param {Function} processRequest       - Middleware para procesar la solicitud.
 * @param {Function} postFilmController   - Controlador para la solicitud POST de información sobre una película.
 */
router.post('/', processRequest, postFilmController);
