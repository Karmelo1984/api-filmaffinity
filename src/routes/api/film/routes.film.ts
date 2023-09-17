import { Request, Response } from 'express';
import express from 'express';
import logger from '../../../logger';
import { processRequest } from '../../../middleware/processRequest';

import { FilmRequest } from '../../../types/Request/FilmRequest';
import { getInfoFilm } from '../../../utils/webScrapper';
import { hasOnlyValidParams } from '../../utils';

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
   const functionName = `router.get /api/film`;
   const payload = res.locals.processedData;
   const properties = ['lang', 'id', 'url'];
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

   const values: FilmRequest = {
      lang: payload.query.lang,
      id: payload.query.id,
      url: payload.body.url,
   };

   const result = await getInfoFilm(values);
   logger.info(`${functionName}  -->  SEND: ${JSON.stringify(payload)}`);

   return res.send(result);
});

router.post('/', processRequest, async (req: Request, res: Response) => {
   const functionName = `router.post /api/film`;
   const payload = res.locals.processedData;
   const properties = ['url'];
   const { method, ...params } = payload;

   logger.info(`${functionName}  -->  RECIVED: ${JSON.stringify(payload)}`);

   if (!hasOnlyValidParams(params, properties)) {
      const msg = `Solo están permitidos los parámetros (${properties}) y has insertado los parámetros (${Object.keys(
         params.body,
      )})`;
      const status = 400;
      logger.error(`${functionName}  -->  ${msg}`);

      return res.status(status).json({
         statusCode: status,
         error: 'Parámetros incorrectos',
         message: `${msg}`,
      });
   }

   const url: string = payload.body.url ?? '';
   const regex = /https:\/\/www.filmaffinity\.com\/(?<lang>\w+)\/film(?<id>\d+)\.html/;
   const match = url.match(regex);

   const values: FilmRequest = {
      lang: payload.query.lang || (match && match.groups?.lang) || '',
      id: payload.query.id || (match && match.groups?.id) || '',
      url: url,
   };

   const result = await getInfoFilm(values);
   logger.info(`${functionName}  -->  SEND: ${JSON.stringify(payload)}`);

   return res.send(result);
});
