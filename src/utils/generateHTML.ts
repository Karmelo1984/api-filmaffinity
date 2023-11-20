import markdownIt from 'markdown-it';
import { CustomError } from '../types/CustomError';
import { varEntorno } from '../..';

import { Logger } from '../models/Logger';
import { ErrorHandler } from '../models/ErrorHandler';
const logger = Logger.getInstance();

export function markdownToHtml(id_request: number, data: string, styleCss: string): string | CustomError {
   const functionName = `markdownToHtml`;
   logger.registerLog('info', functionName, 'START', id_request, `styleCss: ${styleCss} data: ${data}`);

   try {
      // Convierte el Markdown en HTML
      const markdownParser = new markdownIt();
      const htmlContent = markdownParser.render(data);

      const html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>API Filmaffinity ${varEntorno.APP_VERSION}</title>
                <style>
                    ${styleCss}
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `;

      logger.registerLog('info', functionName, 'END', id_request, `styleCss: ${styleCss} data: ${htmlContent}`);
      return html;
   } catch (error) {
      const errorHandler = new ErrorHandler(functionName, id_request);

      return errorHandler.handleError(error);
   }
}

/**
 * Combina el contenido de un archivo original con el contenido de un nuevo archivo,
 * después de eliminar una parte del contenido original a partir de una frase de referencia.
 *
 * @param {string} originalContent  - El contenido del archivo original.
 * @param {string} newContent       - El contenido del archivo que se agregará.
 * @param {string} referencePhrase  - La frase de referencia a partir de la cual se eliminará
 * el contenido del archivo original.
 * @returns {string} - El contenido resultante después de la combinación o el texto
 * original si ocurre un error.
 */
export function mergeMarkdownFiles(
   id_request: number,
   originalContent: string,
   newContent: string,
   referencePhrase: string,
): string {
   const functionName = `mergeMarkdownFiles`;
   logger.registerLog('info', functionName, 'START', id_request, `originalContent, newContent, referencePhrase`);

   try {
      const modOriginalContent = removeContentFromString(id_request, originalContent, referencePhrase);
      const text = appendFileToFile(id_request, modOriginalContent, newContent);

      logger.registerLog('info', functionName, 'END', id_request, `${text}`);
      return text;
   } catch (error) {
      const errorHandler = new ErrorHandler(functionName, id_request);

      errorHandler.handleError(error);
      return originalContent;
   }
}

/**
 * Elimina contenido de una cadena de texto a partir de una frase de referencia.
 *
 * @param {string} content          - La cadena de texto de origen de la cual se eliminará contenido.
 * @param {string} referencePhrase  - La frase de referencia a partir de la cual se eliminará el contenido.
 * @returns {string}                - La cadena de texto resultante después de la eliminación o el texto
 * original si ocurre un error.
 */
function removeContentFromString(id_request: number, content: string, referencePhrase: string): string {
   const functionName = `removeContentFromString`;
   logger.registerLog('info', functionName, 'START', id_request, `content, referencePhrase`);

   try {
      const referenceIndex = content.indexOf(referencePhrase);
      const contentBeforeReference = content.substring(0, referenceIndex);

      logger.registerLog('info', functionName, 'END', id_request, `${contentBeforeReference}`);
      return contentBeforeReference;
   } catch (error) {
      const errorHandler = new ErrorHandler(functionName, id_request);
      errorHandler.handleError(error);

      return content;
   }
}

/**
 * Agrega el contenido de una fuente a un destino.
 *
 * @param {string} sourceContent       - Contenido principal sobre el que se agregará el resto.
 * @param {string} destinationContent  - Contenido a añadir al continuación del texto fuente.
 * @returns {string | CustomError}     - El contenido resultante después de la adición o el texto
 * original si ocurre un error.
 */
function appendFileToFile(id_request: number, sourceContent: string, destinationContent: string): string {
   const functionName = `appendFileToFile`;
   logger.registerLog('info', functionName, 'START', id_request, `sourceContent, destinationContent`);

   try {
      const text = (sourceContent += destinationContent);

      logger.registerLog('info', functionName, 'END', id_request, `${text}`);
      return text;
   } catch (error) {
      const errorHandler = new ErrorHandler(functionName, id_request);
      errorHandler.handleError(error);

      return sourceContent;
   }
}
