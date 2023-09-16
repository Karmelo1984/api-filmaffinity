import { Request, Response } from 'express';
import express from 'express';
import logger from '../../../logger';
import { processRequest } from '../../../middleware/processRequest';

import { FilmRequest } from '../../../types/Request/FilmRequest';
import { getInfoFilm } from '../../../utils/webScrapper';

export { router };

const router = express.Router();

/**
 * Ruta GET para recuperar información detallada de una película según la solicitud proporcionada.
 *
 * Esta ruta utiliza el middleware 'processRequest' para capturar y procesar los datos de la solicitud HTTP.
 * Luego, recupera la información detallada de una película utilizando el objeto 'payload' de la solicitud y llama a la función 'getInfoFilm'.
 * Finalmente, envía la respuesta con la información de la película o un mensaje de error si no se encuentra la película.
 *
 * @function '/api/film'
 * @param {Request} req       - Solicitud HTTP.
 * @param {Response} res      - Respuesta HTTP.
 */
router.get('/', processRequest, async (req: Request, res: Response) => {
   const payload = res.locals.processedData;
   logger.info(`[${'router.get /api/film'.padEnd(25, ' ')}]  -->  payload: ${JSON.stringify(payload)}`);

   const values: FilmRequest = {
      lang: payload.query.lang,
      id: payload.query.id,
   };

   return res.send(await getInfoFilm(values));
});
