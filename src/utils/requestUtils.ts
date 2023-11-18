import logger from '../logger';
import { CustomError } from '../types/CustomError';

export interface GenericRequest {
   [key: string]: string;
}

/**
 * Valida y extrae parámetros de una solicitud.
 *
 * @param {Object} res - Objeto de respuesta de la solicitud.
 * @param {string[]} properties - Lista de propiedades permitidas.
 * @throws {CustomError} Lanza un error si los parámetros no son válidos.
 * @returns {Object} Objeto con parámetros validados.
 */
export const validateAndExtractParams = (res: any, properties: string[]): any | CustomError => {
   const functionName: string = 'validateAndExtractParams';
   const payload = res.locals.processedData;
   logger.info(`${functionName}  -->  START: ${JSON.stringify(payload)}`);

   const { method, ...params } = payload;
   const parametros = extractSecondLevelElements(params);

   if (!hasOnlyValidParams(parametros, properties)) {
      const msg = `Parámetros permitidos [${properties.join(', ')}]. Parámetros insertados [${parametros.join(', ')}]`;
      const status = 400;
      logger.error(`${functionName}  -->  ${msg}`);

      const customError: CustomError = {
         statusCode: 400,
         message: 'Parámetros incorrectos',
         body: `${msg}`,
      };
      logger.error(`${functionName}  -->  THROW: ${JSON.stringify(payload)}`);

      throw customError;
   }

   const values: GenericRequest = {};

   properties.forEach((property) => {
      const value =
         (payload.query && payload.query[property]) ||
         (payload.body && payload.body[property]) ||
         (payload.params && payload.params[property]);
      if (value) {
         values[property] = value;
      }
   });

   logger.debug(`${functionName}  -->  EXIT: ${JSON.stringify(values)}`);
   return values;
};

/**
 * Analiza el segundo nivel de un objeto y devuelve un array con los elementos deseados.
 *
 * @param {Record<string, any>} objeto    - El objeto a analizar.
 * @returns {string[]} Un array con los elementos del segundo nivel del objeto; de lo contrario un array vacío.
 */
export function extractSecondLevelElements(objeto: Record<string, any>): string[] {
   const elementosSegundoNivel = [];

   for (const key in objeto) {
      if (typeof objeto[key] === 'object' && objeto[key] !== null) {
         for (const subKey in objeto[key]) {
            elementosSegundoNivel.push(subKey);
         }
      }
   }

   return elementosSegundoNivel;
}

/**
 * Comprueba si todos los elementos de un array están presentes en otro array.
 *
 * @param {string[]} elementos            - Array de elementos a verificar.
 * @param {string[]} array                - Array contra el que se debe comprobar.
 * @returns {boolean} `true` si todos los elementos están en el array; de lo contrario, `false`.
 */
export function hasOnlyValidParams(elementos: string[], array: string[]): boolean {
   return elementos.every((element) => array.includes(element));
}
