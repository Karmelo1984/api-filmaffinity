import { Request, Response } from 'express';
import { validateAndExtractParams } from '../../../utils/requestUtils';
import logger from '../../../logger';
import { getSearch } from '../../../utils/webScrapper';
import { SearchRequest } from '../../../types/Request/SearchRequest';

/**
 * Controlador para obtener una búsqueda de películas mediante una solicitud GET.
 *
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 */
export const searchController = async (req: Request, res: Response) => {
   const functionName = 'searchController';
   const propertiesSearch = ['lang', 'query', 'year'];

   logger.info(`${functionName}  -->  START: router.get /api/search`);

   try {
      const searchValues: any = validateAndExtractParams(res, propertiesSearch);
      const values: SearchRequest = {
         lang: searchValues.lang,
         query: searchValues.query,
         year: parseInt(searchValues.year),
      };

      if (searchValues) {
         const result = await getSearch(values);
         logger.debug(`${functionName}  -->  EXIT: router.get /api/search`);

         return res.send(result);
      }
   } catch (error) {
      logger.error(`${functionName}  -->  CATCH: router.get /api/search`);

      return res.send(error);
   }
};
