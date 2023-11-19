import { Request, Response } from 'express';
import logger from '../logger';
import { validateAndExtractParams } from '../utils/requestUtils';
import { mergeMarkdownFiles, markdownToHtml } from '../utils/generateHTML';

import * as fs from 'fs';
import * as path from 'path';
const releaseNotesMD = path.join(__dirname, '../../CHANGELOG.md');
const readmeMD = path.join(__dirname, '../../README.md');
const cssFilePath = path.join(__dirname, '../styles/style_03.css');

/**
 * Controlador para obtener la funcionalidad de la API mediante una petición GET.
 *
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 */
export const rootController = async (req: Request, res: Response) => {
   const functionName = 'rootController';
   const propertiesSearch = [''];

   logger.info(`${functionName}  -->  START: router.get /`);

   try {
      validateAndExtractParams(res, propertiesSearch);

      const styleCss: string = fs.readFileSync(cssFilePath, 'utf8');
      const relesaeNotes: string = fs.readFileSync(releaseNotesMD, 'utf8');
      const readme: string = fs.readFileSync(readmeMD, 'utf8');

      const newDocument: string = mergeMarkdownFiles(readme, relesaeNotes.replace(/^#/gm, '##'), '## API-REST');
      const result = markdownToHtml(newDocument, styleCss);

      logger.debug(`${functionName}  -->  END: router.get /`);
      return res.send(result);
   } catch (error) {
      logger.error(`${functionName}  -->  CATCH: router.get /`);

      return res.send(error);
   }
};
