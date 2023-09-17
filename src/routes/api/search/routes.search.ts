import { Request, Response } from 'express';
import express from 'express';
import logger from '../../../logger';
import { processRequest } from '../../../middleware/processRequest';

import { SearchRequest, validateSearchRequest } from '../../../types/Request/SearchRequest';
import { getSearch } from '../../../utils/webScrapper';
import { hasOnlyValidParams } from '../../utils';

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
router.get('/', processRequest, async (req: Request, res: Response) => {
   const functionName = `router.get /api/search`;
   const payload = res.locals.processedData;
   const properties = ['lang', 'query', 'year'];
   const { method, ...params } = payload;

   logger.info(`${functionName}  -->  RECIVED: ${JSON.stringify(payload)}`);

   if (!hasOnlyValidParams(params, properties)) {
      const msg = `Solo están permitidos los parámetros (${properties}) y has insertado los parámetros (${Object.keys(
         params.query,
      )})`;
      const status = 400;
      logger.error(`${functionName}  -->  ${msg}`);

      return res.status(status).json({
         statusCode: status,
         error: 'Parámetros incorrectos',
         message: `${msg}`,
      });
   }

   const values: SearchRequest = {
      lang: payload.query.lang,
      query: payload.query.query,
      year: payload.query.year,
   };

   const validationResult = validateSearchRequest(values);

   if (!validationResult.isValid) {
      logger.error(`${validationResult.message}  -->  ${JSON.stringify(payload)}`);
      return res.status(validationResult.statusCode).json({ error: validationResult.message });
   }

   const result = await getSearch(values);
   logger.info(`${functionName}  -->  SEND: ${JSON.stringify(payload)}`);

   return res.send(result);
});
