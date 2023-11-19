import { Request, Response } from 'express';
import logger from '../../logger';
import { validateAndExtractParams } from '../../utils/requestUtils';
import { markdownToHtml } from '../../utils/generateHTML';

import * as fs from 'fs';
import * as path from 'path';
const apiMD = path.join(__dirname, '../../docs/api.md');
const cssFilePath = path.join(__dirname, '../../styles/style_03.css');

/**
 * Controlador para obtener la funcionalidad de la API mediante una petición GET.
 *
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 */
export const apiController = async (req: Request, res: Response) => {
   const functionName = 'apiController';
   const propertiesSearch = [''];

   logger.info(`${functionName}  -->  START: router.get /api`);

   try {
      validateAndExtractParams(res, propertiesSearch);

      const data: string = fs.readFileSync(apiMD, 'utf8');
      const styleCss: string = fs.readFileSync(cssFilePath, 'utf8');
      const result = markdownToHtml(data, styleCss);

      logger.debug(`${functionName}  -->  END: router.get /api`);
      return res.send(result);
   } catch (error) {
      logger.error(`${functionName}  -->  CATCH: router.get /api`);

      return res.send(error);
   }
};
