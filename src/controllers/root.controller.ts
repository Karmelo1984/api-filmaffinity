import { Request, Response } from 'express';
import { sanitizeParams } from '../utils/requestUtils';
import { Logger } from '../models/Logger';
const logger = Logger.getInstance();

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
   const id_request = parseInt(res.locals.processedData.id_request);
   logger.registerLog('info', functionName, 'START', id_request, 'router.get /');

   const propertiesSearch = [''];

   try {
      sanitizeParams(res, propertiesSearch);

      const styleCss: string = fs.readFileSync(cssFilePath, 'utf8');
      const relesaeNotes: string = fs.readFileSync(releaseNotesMD, 'utf8');
      const readme: string = fs.readFileSync(readmeMD, 'utf8');

      const newDocument: string = mergeMarkdownFiles(
         id_request,
         readme,
         relesaeNotes.replace(/^#/gm, '##'),
         '## API-REST',
      );
      const result = markdownToHtml(id_request, newDocument, styleCss);

      logger.registerLog('info', functionName, 'END', id_request, 'router.get /');
      return res.send(result);
   } catch (error) {
      logger.registerLog('info', functionName, 'CATCH', id_request, 'router.get /');
      return res.send(error);
   }
};
