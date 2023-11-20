import { Logger } from 'winston';

export interface CustomError {
   statusCode: number;
   message: string;
   body?: string | undefined;
}

/**
 * Maneja un error, registra un mensaje de error en el logger y devuelve un objeto CustomError.
 *
 * @param {Logger} logger  - El objeto de registro de eventos.
 * @param {string} msgLog  - El mensaje de registro personalizado.
 * @param {any} error      - El error que se va a manejar.
 * @param {any} [body]     - El cuerpo del error opcional.
 * @returns {CustomError}  - Un objeto CustomError que representa el error manejado.
 */
export function handleError(logger: Logger, msgLog: string, error: any, body: any = undefined): CustomError {
   const msg = (error as any).message;
   logger.error(`${msgLog}  -->  CATCH: ${msg}`);

   const customError: CustomError = {
      statusCode: (error as any).statusCode || 500,
      message: msg,
      body: (error as any).response ? (error as any).response.body : body,
   };

   return customError;
}

/**
 * Crea un objeto CustomError con un mensaje y código de estado personalizados.
 *
 * @param {Logger} logger  - El objeto de registro de eventos.
 * @param {string} msgLog  - El mensaje de registro personalizado.
 * @param {string} msg     - El mensaje de error personalizado.
 * @param {number} [statusCode=500] - El código de estado del error (por defecto: 500).
 * @param {any} [body]     - El cuerpo del error opcional.
 * @returns {CustomError}  - Un objeto CustomError que representa el error personalizado.
 */
export function createError(
   logger: Logger,
   msgLog: string,
   msg: string,
   statusCode: number = 500,
   body: any = undefined,
): CustomError {
   logger.error(`${msgLog}  -->  CATCH: ${msg}`);

   const customError: CustomError = {
      statusCode,
      message: msg,
      body,
   };

   return customError;
}
