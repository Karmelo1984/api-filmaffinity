import express from 'express';
import { processRequest } from '../../middleware/processRequest';
import { apiController } from '../../controllers/api/api.controller';

export { router };
const router = express.Router();

/**
 * Ruta para obtener la funcionalidad de la API mediante una solicitud GET.
 *
 * @name GET /api
 * @memberof module:FilmRouter
 *
 * @param {Function} processRequest     - Middleware para procesar la solicitud.
 * @param {Function} apiController      - Controlador para la solicitud GET de información sobre la API.
 */
router.get('/', processRequest, apiController);
