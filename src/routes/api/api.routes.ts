import express from 'express';
import { processRequest } from '../../middleware/processRequest';
import { apiController } from '../../controllers/api/api.controller';

export { router };
const router = express.Router();

/**
 * Maneja una solicitud HTTP GET en la ruta ('/api').
 *
 * @function '/api'
 * @returns {void}
 */
router.get('/', processRequest, apiController);
