import express from 'express';
import { processRequest } from '../../../middleware/processRequest';
import { searchController } from '../../../controllers/api/search/search.controller';

export { router };
const router = express.Router();

/**
 * Ruta para buscar información sobre películas mediante una solicitud GET.
 *
 * @name GET /api/search
 * @memberof module:SearchRouter
 *
 * @param {Function} processRequest       - Middleware para procesar la solicitud.
 * @param {Function} searchController     - Controlador para la solicitud GET de busquedas de películas.
 */
router.get('/', processRequest, searchController);
