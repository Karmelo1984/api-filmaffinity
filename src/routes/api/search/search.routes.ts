import { Request, Response } from 'express';
import express from 'express';
import { processRequest } from '../../../middleware/processRequest';
import { searchController } from './search.controller';

export { router };
const router = express.Router();

/**
 * Ruta GET para realizar una búsqueda según la solicitud proporcionada.
 *
 * Esta ruta utiliza el middleware 'processRequest' para capturar y procesar los datos de la solicitud HTTP.
 * Luego, construye una solicitud de búsqueda utilizando el objeto 'payload' de la solicitud y llama a la función 'validateSearchRequest' para validarla.
 * Si la solicitud de búsqueda no es válida, se registra un mensaje de error y se envía una respuesta de error al cliente.
 * Si la solicitud de búsqueda es válida, se llama a la función 'getSearch' para realizar la búsqueda y se envía la respuesta al cliente.
 *
 * @function '/api/search'
 * @param {Request} req - Solicitud HTTP.
 * @param {Response} res - Respuesta HTTP.
 */
router.get('/', processRequest, searchController);
