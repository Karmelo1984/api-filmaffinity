import { Request, Response } from 'express';
import express from 'express';
import logger from '../../logger';
import { sendReadmeAsHtml } from '../../utils/generateHTML';

import * as fs from 'fs';
import * as path from 'path';

export { router };
const router = express.Router();

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
router.get('/', (req: Request, res: Response) => {
   logger.info(`router.get /api/  -->  `);

   const data: string = fs.readFileSync(apiMD, 'utf8');
   const styleCss: string = fs.readFileSync(cssFilePath, 'utf8');

   const result = sendReadmeAsHtml(data, styleCss);

   res.send(result);
});
