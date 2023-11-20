import { Logger } from './Logger';
const logger = Logger.getInstance();

import { CustomError } from '../types/CustomError';

/**
 * Manejador de errores personalizado.
 * @class
 */
export class ErrorHandler {
   private functionName: string;
   private id_request: number;

   /**
    * Crea una instancia de ErrorHandler.
    * @constructor
    * @param {string} functionName     - El nombre de la función donde se utiliza la instancia.
    * @param {number} id_request       - El ID de la solicitud asociada al manejo de errores.
    */
   constructor(functionName: string, id_request: number) {
      logger.registerLog('debug', functionName, 'BUILD', id_request, `class ErrorHandler`);

      this.functionName = functionName;
      this.id_request = id_request;
   }

   /**
    * Maneja un error y devuelve una representación personalizada del error.
    * @param {any} error               - Objeto ERROR a tratar.
    * @param {any} [body]              - Descripción detallada del error.
    * @returns {CustomError}           - Objeto con los parámetros del error.
    */
   handleError(error: any, body: any = undefined): CustomError {
      const msg: string = (error as any).message;
      logger.registerLog('error', this.functionName, 'CATCH', this.id_request, `${msg}`);

      const customError: CustomError = {
         statusCode: (error as any).statusCode || 500,
         message: msg,
         body: (error as any).response ? (error as any).response.body : body,
      };

      return customError;
   }

   /**
    * Crea un error personalizado con el mensaje, el código de estado y el cuerpo proporcionados.
    * @param {string} msg              - Mensaje descriptivo del error.
    * @param {number} [statusCode=500] - Código de estado HTTP del error.
    * @param {any} [body]              - Descripción detallada del error.
    * @returns {CustomError}           - Objeto con los parámetros del error.
    */
   createError(msg: string, statusCode: number = 500, body: any = undefined): CustomError {
      logger.registerLog('error', this.functionName, 'CATCH', this.id_request, `${msg}`);

      const customError: CustomError = {
         statusCode,
         message: msg,
         body,
      };

      return customError;
   }
}
