import markdownIt from 'markdown-it';
import logger from '../logger';
import { CustomError, handleError } from '../types/CustomError';
import { varEntorno } from '../..';

/**
 * Convierte un documento en formato Markdown a HTML.
 *
 * @param {string} data          - El contenido en formato Markdown a convertir a HTML.
 * @param {string} styleCss      - El CSS personalizado para aplicar al documento HTML.
 * @returns {string|CustomError} - El documento HTML resultante o un objeto CustomError si se produce un error.
 */
export function sendReadmeAsHtml(data: string, styleCss: string): string | CustomError {
   const functionName = `sendReadmeAsHtml`;
   logger.info(`${functionName}  -->  INICIO de la función`);

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
      logger.debug(`${functionName}  -->  FIN de la función: ${htmlContent}`);

      return html;
   } catch (error) {
      return handleError(logger, 'sendReadmeAsHtml', error);
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
export function mergeMarkdownFiles(originalContent: string, newContent: string, referencePhrase: string): string {
   const functionName = `mergeMarkdownFiles`;
   logger.info(`${functionName}  -->  INICIO de la función`);

   try {
      const modOriginalContent = removeContentFromString(originalContent, referencePhrase);
      const text = appendFileToFile(modOriginalContent, newContent);

      logger.debug(`${functionName}  -->  FIN de la función: ${text}`);

      return text;
   } catch (error) {
      logger.error(`${functionName}  -->  SIN MODIFICAR: ${error}`);

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
function removeContentFromString(content: string, referencePhrase: string): string {
   const functionName = `removeContentFromString`;
   logger.info(`${functionName}  -->  INICIO de la función`);

   try {
      const referenceIndex = content.indexOf(referencePhrase);
      const contentBeforeReference = content.substring(0, referenceIndex);

      logger.debug(`${functionName}  -->  FIN de la función: ${contentBeforeReference}`);

      return contentBeforeReference;
   } catch (error) {
      logger.error(`${functionName}  -->  SIN MODIFICAR: ${error}`);

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
function appendFileToFile(sourceContent: string, destinationContent: string): string {
   const functionName = `appendFileToFile`;
   logger.info(`${functionName}  -->  INICIO de la función`);

   try {
      const text = (sourceContent += destinationContent);

      logger.debug(`${functionName}  -->  FIN de la función: ${text}`);

      return text;
   } catch (error) {
      logger.error(`${functionName}  -->  SIN MODIFICAR: ${error}`);

      return sourceContent;
   }
}
