import { Request, Response } from 'express';
import express from 'express';
import logger from '../logger';
import { processRequest } from '../middleware/processRequest';
import { sendReadmeAsHtml, mergeMarkdownFiles } from '../utils/generateHTML';
import { extractSecondLevelElements } from './utils';

export { router };
const router = express.Router();

import * as fs from 'fs';
import * as path from 'path';

const releaseNotesMD = path.join(__dirname, '../../CHANGELOG.md');
const readmeMD = path.join(__dirname, '../../README.md');
const cssFilePath = path.join(__dirname, '../styles/style_03.css');

/**
 * Maneja una solicitud HTTP GET en la ruta ('/api') y responde con un contenido HTML generado a partir de archivos.
 *
 * @function '/api'
 * @param {Request} req - Objeto de solicitud Express.
 * @param {Response} res - Objeto de respuesta Express.
 * @returns {void}
 */
router.get('/', processRequest, async (req: Request, res: Response) => {
   const functionName = `router.get /`;
   const payload = res.locals.processedData;
   const { method, ...params } = payload;

   logger.info(`${functionName}  -->  RECIVED: ${JSON.stringify(payload)}`);
   logger.debug(`${functionName}  -->  releaseNotesMD: ${releaseNotesMD}`);
   logger.debug(`${functionName}  -->  readmeMD: ${readmeMD}`);

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

   const styleCss: string = fs.readFileSync(cssFilePath, 'utf8');
   const relesaeNotes: string = fs.readFileSync(releaseNotesMD, 'utf8');
   const readme: string = fs.readFileSync(readmeMD, 'utf8');

   const newDocument: string = mergeMarkdownFiles(readme, relesaeNotes.replace(/^#/gm, '##'), '## API-REST');
   const result = sendReadmeAsHtml(newDocument, styleCss);

   logger.info(`${functionName}  -->  SEND: ${JSON.stringify(payload)}`);
   return res.send(result);
});
