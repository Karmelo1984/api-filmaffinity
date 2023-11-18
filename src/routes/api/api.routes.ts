import { Request, Response } from 'express';
import express from 'express';
import logger from '../../logger';
import { processRequest } from '../../middleware/processRequest';
import { sendReadmeAsHtml } from '../../utils/generateHTML';
import { extractSecondLevelElements } from '../utils';

export { router };
const router = express.Router();

import * as fs from 'fs';
import * as path from 'path';

const apiMD = path.join(__dirname, '../../docs/api.md');
const cssFilePath = path.join(__dirname, '../../styles/style_03.css');

/**
 * Maneja una solicitud HTTP GET en la ruta ('/api') y responde con un contenido HTML generado a partir de archivos.
 *
 * @function '/api'
 * @param {Request} req - Objeto de solicitud Express.
 * @param {Response} res - Objeto de respuesta Express.
 * @returns {void}
 */
router.get('/', processRequest, async (req: Request, res: Response) => {
   const functionName = `router.get /api`;
   const payload = res.locals.processedData;
   const { method, ...params } = payload;

   logger.info(`${functionName}  -->  RECIVED: ${JSON.stringify(payload)}`);
   logger.debug(`${functionName}  -->  apiMD: ${apiMD}`);
   logger.debug(`${functionName}  -->  cssFilePath: ${cssFilePath}`);

   const parametros = extractSecondLevelElements(params);

   if (parametros.length !== 0) {
      const msg = `Esta ruta no permite parámetros y has insertado [${parametros}]})`;
      const status = 400;

      logger.error(`${functionName}  -->  ${msg}`);

      return res.status(status).json({
         statusCode: status,
         error: 'Parámetros incorrectos',
         message: `${msg}`,
      });
   }

   const data: string = fs.readFileSync(apiMD, 'utf8');
   const styleCss: string = fs.readFileSync(cssFilePath, 'utf8');

   const result = sendReadmeAsHtml(data, styleCss);

   logger.info(`${functionName}  -->  SEND: ${JSON.stringify(payload)}`);
   res.send(result);
});
