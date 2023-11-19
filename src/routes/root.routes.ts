import express from 'express';
import { processRequest } from '../middleware/processRequest';
import { rootController } from '../controllers/root.controller';

export { router };
const router = express.Router();

/**
 * Maneja una solicitud HTTP GET en la ruta ('/') y responde con un contenido HTML generado a partir de archivos.
 *
 * @function '/api'
 * @param {Request} req - Objeto de solicitud Express.
 * @param {Response} res - Objeto de respuesta Express.
 * @returns {void}
 */
router.get('/', processRequest, rootController);
