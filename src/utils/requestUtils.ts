import { CustomError } from '../types/CustomError';
import { ProcessedData } from '../types/ProcessedData';

import { Logger } from '../models/Logger';
const logger = Logger.getInstance();

export interface GenericRequest {
   [key: string]: string;
}

/**
 * Procesa y valida los parámetros de una solicitud, asegurando que solo contenga las propiedades permitidas.
 *
 * @param {any} res                          - Objeto de respuesta de Express.
 * @param {string[]} properties              - Lista de propiedades permitidas.
 * @returns {GenericRequest | CustomError}   - Un objeto con las propiedades válidas o un error personalizado en caso de parámetros incorrectos.
 * @throws {CustomError}                     - Error personalizado con detalles sobre los parámetros incorrectos.
 */
export const sanitizeParams = (res: any, properties: string[]): GenericRequest | CustomError => {
   const functionName: string = 'sanitizeParams';
   const payload: ProcessedData = res.locals.processedData;
   const { id_request, method, ...params } = payload;
   const payloadString = JSON.stringify(payload);

   logger.registerLog('info', functionName, 'START', id_request, payloadString);

   const secondLevelKeys = getClavesSegundoNivel(params);

   if (!hasOnlyValidParams(secondLevelKeys, properties)) {
      const msg = `Parámetros permitidos [${properties.join(', ')}]. Parámetros insertados [${secondLevelKeys.join(
         ', ',
      )}]`;
      const status = 400;

      const customError: CustomError = {
         statusCode: status,
         message: 'Parámetros incorrectos',
         body: `${msg}`,
      };

      logger.registerLog('error', functionName, 'CATCH', id_request, payloadString);
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

   logger.registerLog('info', functionName, 'END', id_request, `${JSON.stringify(payload)}`);
   return values;
};

/**
 * Analiza el segundo nivel de un objeto y devuelve un array con los elementos deseados.
 *
 * @param {Record<string, any>} objeto    - El objeto a analizar.
 * @returns {string[]}                    - Un array con los elementos del segundo nivel del objeto; de lo contrario un array vacío.
 */
export const getClavesSegundoNivel = (objeto: Record<string, any>): string[] => {
   const clavesSegundoNivel = [];

   for (const clavePrincipal in objeto) {
      if (typeof objeto[clavePrincipal] === 'object' && objeto[clavePrincipal] !== null) {
         for (const claveSecundaria in objeto[clavePrincipal]) {
            clavesSegundoNivel.push(claveSecundaria);
         }
      }
   }

   return clavesSegundoNivel;
};

/**
 * Comprueba si todos los elementos de un array están presentes en otro array.
 *
 * @param {string[]} elementos   - Array de elementos a verificar.
 * @param {string[]} array       - Array contra el que se debe comprobar.
 * @returns {boolean}            - `true` si todos los elementos están en el array; de lo contrario, `false`.
 */
export const hasOnlyValidParams = (elementos: string[], array: string[]): boolean => {
   return elementos.every((element) => array.includes(element));
};
