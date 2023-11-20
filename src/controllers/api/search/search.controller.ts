import { Request, Response } from 'express';
import { sanitizeParams } from '../../../utils/requestUtils';
import { Logger } from '../../../models/Logger';
const logger = Logger.getInstance();

import { getSearch } from '../../../utils/webScrapper';
import { SearchRequest } from '../../../types/Request/SearchRequest';

/**
 * Controlador para obtener una búsqueda de películas mediante una solicitud GET.
 *
 * @param {Request} req    - Objeto de solicitud de Express.
 * @param {Response} res   - Objeto de respuesta de Express.
 */
export const searchController = async (req: Request, res: Response) => {
   const functionName = 'searchController';
   const id_request = parseInt(res.locals.processedData.id_request);
   logger.registerLog('info', functionName, 'START', id_request, 'router.??? /api/search');

   const propertiesSearch = ['lang', 'query', 'year'];

   try {
      const searchValues: any = sanitizeParams(res, propertiesSearch);
      const values: SearchRequest = {
         id_request: id_request,
         lang: searchValues.lang,
         query: searchValues.query,
         year: parseInt(searchValues.year),
      };

      if (searchValues) {
         const result = await getSearch(values);

         logger.registerLog('info', functionName, 'END', id_request, 'router.??? /api/search');
         return res.send(result);
      }
   } catch (error) {
      logger.registerLog('error', functionName, 'CATCH', id_request, 'router.??? /api/search');
      return res.send(error);
   }
};
