import { Request, Response } from 'express';
import { sanitizeParams } from '../../../utils/requestUtils';
import { Logger } from '../../../models/Logger';
const logger = Logger.getInstance();

import { getInfoFilm } from '../../../utils/webScrapper';
import { FilmRequest } from '../../../types/Request/FilmRequest';

/**
 * Controlador para manejar solicitudes GET para obtener información relacionadas con películas.
 *
 * @param {Request} req          - Objeto de solicitud de Express.
 * @param {Response} res         - Objeto de respuesta de Express.
 * @returns {Promise<Response>}  - Promesa que representa la respuesta del controlador.
 */
export const getFilmController = async (req: Request, res: Response): Promise<Response> => {
   const propSearch = ['lang', 'id', 'url'];
   const functionName = 'getFilmController';

   const extractValuesFn = (filmValues: any) => ({
      id_request: res.locals.processedData.id_request,
      lang: filmValues.lang,
      id: filmValues.id,
      url: filmValues.url,
   });

   return await handleFilmRequest(req, res, functionName, propSearch, extractValuesFn);
};

/**
 * Controlador para manejar solicitudes POST para obtener información relacionadas con películas.
 *
 * @param {Request} req          - Objeto de solicitud de Express.
 * @param {Response} res         - Objeto de respuesta de Express.
 * @returns {Promise<Response>}  - Promesa que representa la respuesta del controlador.
 */
export const postFilmController = async (req: Request, res: Response): Promise<Response> => {
   const propSearch = ['url'];
   const functionName = 'postFilmController';

   const extractValuesFn = (filmValues: any): FilmRequest => {
      const url: string = filmValues.url ?? '';
      const regex = /https:\/\/www.filmaffinity\.com\/(?<lang>\w+)\/film(?<id>\d+)\.html/;
      const match = url.match(regex);

      return {
         id_request: res.locals.processedData.id_request,
         lang: (match && match.groups?.lang) || '',
         id: parseInt((match && match.groups?.id) || '-1'),
         url: filmValues.url,
      };
   };
   return await handleFilmRequest(req, res, functionName, propSearch, extractValuesFn);
};

/**
 * Maneja la lógica central de procesamiento de solicitudes relacionadas con películas.
 *
 * @param {Request} req                - Objeto de solicitud de Express.
 * @param {Response} res               - Objeto de respuesta de Express.
 * @param {string} functionName        - Nombre de la función.
 * @param {string[]} propertiesSearch  - Lista de propiedades a buscar en la solicitud.
 * @param {Function} extractValuesFn   - Función para extraer valores específicos.
 * @returns {Promise<Response>}        - Promesa que representa la respuesta del manejador.
 */
const handleFilmRequest = async (
   req: Request,
   res: Response,
   functionName: string,
   propertiesSearch: string[],
   extractValuesFn: Function,
): Promise<Response> => {
   const id_request = parseInt(res.locals.processedData.id_request);
   logger.registerLog('info', functionName, 'START', id_request, 'router.??? /api/film');

   try {
      const filmValues: any = sanitizeParams(res, propertiesSearch);
      const values: FilmRequest = extractValuesFn(filmValues);
      const result = await getInfoFilm(values);

      logger.registerLog('info', functionName, 'END', id_request, 'router.??? /api/film');
      return res.send(result);
   } catch (error) {
      logger.registerLog('error', functionName, 'CATCH', id_request, 'router.??? /api/film');
      return res.send(error);
   }
};
