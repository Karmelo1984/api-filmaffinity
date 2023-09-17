import { Request, Response } from 'express';
import express from 'express';
import logger from '../logger';
import { sendReadmeAsHtml, mergeMarkdownFiles } from '../utils/generateHTML';

import * as fs from 'fs';
import * as path from 'path';

const releaseNotesMD = path.join(__dirname, '../docs/release-notes.md');
const readmeMD = path.join(__dirname, '../../README.md');
const cssFilePath = path.join(__dirname, '../styles/style_03.css');

export { router };

const router = express.Router();

/**
 * Maneja una solicitud HTTP GET en la ruta ('/api') y responde con un contenido HTML generado a partir de archivos.
 *
 * @function '/api'
 * @param {Request} req - Objeto de solicitud Express.
 * @param {Response} res - Objeto de respuesta Express.
 * @returns {void}
 */
router.get('/', (req: Request, res: Response) => {
   logger.info(`router.get /  -->  `);
   logger.debug(`router.get /  -->  releaseNotesMD: ${releaseNotesMD}`);
   logger.debug(`router.get /  -->  readmeMD: ${readmeMD}`);

   const styleCss: string = fs.readFileSync(cssFilePath, 'utf8');

   const relesaeNotes: string = fs.readFileSync(releaseNotesMD, 'utf8');
   const readme: string = fs.readFileSync(readmeMD, 'utf8');

   const newDocument: string = mergeMarkdownFiles(readme, relesaeNotes, '## API-REST');

   const result = sendReadmeAsHtml(newDocument, styleCss);

   res.send(result);
});
