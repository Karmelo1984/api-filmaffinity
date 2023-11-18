import { Request, Response } from 'express';

import logger from '../../../logger';

import { validateAndExtractParams } from '../../../utils/requestUtils';
import { getInfoFilm } from '../../../utils/webScrapper';

import { FilmRequest } from '../../../types/Request/FilmRequest';

/**
 * Controlador para obtener información sobre una película mediante una solicitud GET.
 *
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 */
export const getFilmController = async (req: Request, res: Response) => {
   const propSearch = ['lang', 'id', 'url'];
   const functionName = 'getFilmController';

   return await handleFilmRequest(req, res, functionName, propSearch, (filmValues: any) => ({
      lang: filmValues.lang,
      id: filmValues.id,
      url: filmValues.url,
   }));
};

/**
 * Controlador para obtener información sobre una película mediante una solicitud POST.
 *
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 */
export const postFilmController = async (req: Request, res: Response) => {
   const propSearch = ['url'];
   const functionName = 'postFilmController';

   return await handleFilmRequest(req, res, functionName, propSearch, (filmValues: any) =>
      extractFilmValues(filmValues),
   );
};

/**
 * Extrae los valores necesarios de la solicitud para crear un objeto FilmRequest.
 *
 * @param {any} filmValues - Valores extraídos de la solicitud.
 * @returns {FilmRequest} Objeto que contiene información sobre la película.
 */
const extractFilmValues = (filmValues: any): FilmRequest => {
   const url: string = filmValues.url ?? '';
   const regex = /https:\/\/www.filmaffinity\.com\/(?<lang>\w+)\/film(?<id>\d+)\.html/;
   const match = url.match(regex);

   return {
      lang: (match && match.groups?.lang) || '',
      id: parseInt((match && match.groups?.id) || '-1'),
      url: filmValues.url,
   };
};

/**
 * Maneja la solicitud para obtener la información sobre una película.
 *
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 * @param {string[]} propertiesSearch - Propiedades a buscar en la solicitud.
 * @param {Function} extractValuesFn - Función para extraer valores de la solicitud.
 */
const handleFilmRequest = async (
   req: Request,
   res: Response,
   functionName: string,
   propertiesSearch: string[],
   extractValuesFn: Function,
) => {
   logger.info(`${functionName}  -->  START: ${req.method} /api/film`);

   try {
      const filmValues: any = validateAndExtractParams(res, propertiesSearch);
      const values: FilmRequest = extractValuesFn(filmValues);

      if (filmValues) {
         const result = await getInfoFilm(values);
         logger.info(`${functionName}  -->  EXIT: ${req.method} /api/film`);

         return res.send(result);
      }
   } catch (error) {
      logger.error(`${functionName}  -->  CATCH: ${req.method} /api/film`);

      return res.send(error);
   }
};
