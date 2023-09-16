import markdownIt from 'markdown-it';
import logger from '../logger';
import { CustomError } from '../types/CustomError';

export function sendReadmeAsHtml(data: string, styleCss: string): string | CustomError {
   logger.info(`sendReadmeAsHtml  -->  `);

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
                <title>API Filmaffinity</title>
                <style>
                    ${styleCss}
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `;
      logger.debug(`sendReadmeAsHtml  -->  html: ${htmlContent}`);

      return html;
   } catch (err) {
      const msg = (err as any).body;
      logger.error(`sendReadmeAsHtml  -->  ${msg}`);

      const customError: CustomError = {
         statusCode: 404,
         message: msg,
      };
      return customError;
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
   logger.info(`mergeMarkdownFiles  -->  `);

   try {
      const modOriginalContent = removeContentFromString(originalContent, referencePhrase);
      return appendFileToFile(modOriginalContent, newContent);
   } catch (error) {
      logger.error(`mergeMarkdownFiles  -->  SIN MODIFICAR: ${error}`);

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
   logger.info(`removeContentFromString  -->  `);

   try {
      const referenceIndex = content.indexOf(referencePhrase);
      const contentBeforeReference = content.substring(0, referenceIndex);

      return contentBeforeReference;
   } catch (error) {
      logger.error(`removeContentFromString  -->  SIN MODIFICAR: ${error}`);

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
   logger.info(`appendFileToFile  -->  `);

   try {
      return (sourceContent += destinationContent);
   } catch (error) {
      logger.error(`appendFileToFile  -->  SIN MODIFICAR: ${error}`);

      return sourceContent;
   }
}
