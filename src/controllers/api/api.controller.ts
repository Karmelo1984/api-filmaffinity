import { Request, Response } from 'express';
import { sanitizeParams } from '../../utils/requestUtils';
import { Logger } from '../../models/Logger';
const logger = Logger.getInstance();

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
   const id_request = parseInt(res.locals.processedData.id_request);
   logger.registerLog('info', functionName, 'START', id_request, 'router.??? /api');

   const propertiesSearch = [''];

   try {
      sanitizeParams(res, propertiesSearch);

      const data: string = fs.readFileSync(apiMD, 'utf8');
      const styleCss: string = fs.readFileSync(cssFilePath, 'utf8');
      const result = markdownToHtml(id_request, data, styleCss);

      logger.registerLog('info', functionName, 'END', id_request, 'router.??? /api');
      return res.send(result);
   } catch (error) {
      logger.registerLog('error', functionName, 'CATCH', id_request, 'router.??? /api');
      return res.send(error);
   }
};
