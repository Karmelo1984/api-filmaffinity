import * as path from 'path';
import winston, { createLogger, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { VariablesEntorno } from '../types/VariablesEntorno';
import { varEntorno } from '../..';

/**
 * Gestiona el registro de logs.
 * @class
 */
export class Logger {
   private static instance: Logger;
   private readonly logger: winston.Logger;
   private readonly path_log: string;

   /**
    * Crea una instancia de Logger.
    * @constructor
    * @param {VariablesEntorno} varEntorno - Objeto con las variables de entorno básicas de la aplicación.
    */
   private constructor(varEntorno: VariablesEntorno) {
      this.path_log = path.join(varEntorno.LOG_PATH, varEntorno.LOG_NAME);

      /**
       * Divide una cadena en dos partes usando un patrón dado.
       * @param {string} texto         - La cadena a dividir.
       * @param {string} patron        - El patrón de división.
       * @returns {[string, string]}   - Un arreglo con las dos partes de la cadena dividida.
       * @private
       */
      const dividirString = (texto: string, patron: string): [string, string] => {
         const index = texto.indexOf(patron); // Encontrar la primera ocurrencia del patrón

         let parte1 = '';
         let parte2 = texto;
         if (index !== -1) {
            parte1 = (texto.substring(0, index) + patron.charAt(0)).trim();
            parte2 = texto.substring(index + patron.length);
         } else {
            // Si no se encuentra el patrón, parte[0] es un string vacío y parte[1] es el texto completo
            return ['', texto];
         }
         return [parte1, parte2];
      };

      /**
       * Centra un texto dentro de un espacio determinado.
       * @param {string} texto         - El texto a centrar.
       * @param {number} maxLen        - La longitud máxima del espacio.
       * @param {string} [relleno=' '] - El carácter de relleno para el centrado.
       * @returns {string}             - El texto centrado.
       * @private
       */
      const centrarTexto = (texto: string, maxLen: number, relleno: string = ' '): string => {
         const espacioExtra = maxLen - texto.length;
         if (espacioExtra <= 0) {
            return texto;
         }

         const espacioIzquierda = Math.floor(espacioExtra / 2);

         const textoCentrado = texto.padStart(texto.length + espacioIzquierda, relleno).padEnd(maxLen, relleno);

         return textoCentrado;
      };

      /**
       * Formatea una entrada de log.
       * @param {string} timestamp     - La marca de tiempo del log.
       * @param {string} level         - El nivel del log.
       * @param {string} message       - El mensaje del log.
       * @returns {string}             - La entrada de log formateada.
       * @private
       */
      const formatLogEntry = (timestamp: string, level: string, message: string): string => {
         const formattedTimestamp = timestamp.padEnd(26, ' ');
         const formattedLevel = level.padEnd(7, ' ');

         return `[${formattedTimestamp}] [${formattedLevel}] ${message}`;
      };

      /**
       * Define una función de formato personalizada para los logs.
       * @param {{ timestamp: string, level: string, message: string }} param0 - Los parámetros del log.
       * @returns {string}             - La entrada de log formateada.
       * @private
       */
      const customFormat = winston.format.printf(({ timestamp, level, message }) => {
         const dateObj = new Date(timestamp);
         const formatter = new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
         });

         const formattedTimestamp =
            formatter.format(dateObj) + `.${dateObj.getMilliseconds().toString().padStart(3, '0')}`;

         const [cabecera, cuerpo] = dividirString(message, '  -->  ');

         const [cuerpo1, cuerpo2] = dividirString(cuerpo, '): ');

         level = centrarTexto(level, 16).replace(/\s+/g, ' ');

         message =
            cabecera.length == 0
               ? cuerpo
               : `[${centrarTexto(cabecera, varEntorno.LOG_HEAD_LEN)}] [ ${cuerpo1} ] ->  ${cuerpo2
                    .replace(/\s+/g, ' ')
                    .trim()
                    .slice(0, 110)}`;

         return formatLogEntry(formattedTimestamp, level, message);
      });

      // Configura el registro de Winston
      this.logger = createLogger({
         level: 'info',
         format: winston.format.combine(
            winston.format.timestamp(), // Agrega una marca de tiempo
            customFormat, // Utiliza la función de formato personalizada
         ),
         transports: [
            new transports.Console({
               level: 'debug',
               format: winston.format.combine(winston.format.colorize(), customFormat),
            }),
            new transports.File({
               level: 'info',
               format: customFormat,
               filename: `${this.path_log}_info.log`,
            }),
            new transports.File({
               level: 'error',
               format: customFormat,
               filename: `${this.path_log}_error.log`,
            }),
            new DailyRotateFile({
               level: 'debug',
               filename: `${this.path_log}_%DATE%.log`,
               format: customFormat,
               datePattern: 'YYYY-MM-DD',
               zippedArchive: true,
               maxSize: '250m',
               maxFiles: '14d',
               createSymlink: false,
            }),
         ],
      });

      // Imprime el encabezado al inicializar la instancia
      this.printHeader();
   }

   /**
    * Obtiene una instancia única de la clase Logger.
    * @returns - Instancia única de la clase Logger.
    */
   public static getInstance(): Logger {
      if (!Logger.instance) {
         Logger.instance = new Logger(varEntorno);
      }
      return Logger.instance;
   }

   /**
    * Registra la ejecución de una función en el nivel de log especificado.
    * @param logLevel         - Nivel de log ('emerg', 'alert', 'crit', 'error', 'warning', 'notice', 'info', 'debug').
    * @param functionName     - Nombre de la función.
    * @param head             - Tipo de ejecución ('BUILD', 'START', 'END', 'CATCH', 'INFO').
    * @param idRequest        - Identificador único de la solicitud.
    * @param message          - Mensaje a registrar.
    */
   public registerLog(
      logLevel: 'emerg' | 'alert' | 'crit' | 'error' | 'warning' | 'notice' | 'info' | 'debug',
      functionName: string,
      head: 'BUILD' | 'START' | 'END' | 'CATCH' | 'INFO',
      idRequest: number,
      message: string,
   ): void {
      const mod_idRequest = idRequest.toString().padStart(10, '0');
      const mod_head = head.padEnd(6, ' ');

      const logMessage = `${functionName}  -->  ${mod_head} (${mod_idRequest}): ${message}`;
      this.logger[logLevel](logMessage);
   }

   /**
    * Imprime el encabezado en todos los registros (por eso que sea el de errores) y por consola.
    */
   private printHeader(): void {
      const header = `

          █████╗ ██████╗ ██╗      ███████╗██╗██╗     ███╗   ███╗ █████╗ ███████╗███████╗██╗███╗   ██╗██╗████████╗██╗   ██╗
         ██╔══██╗██╔══██╗██║      ██╔════╝██║██║     ████╗ ████║██╔══██╗██╔════╝██╔════╝██║████╗  ██║██║╚══██╔══╝╚██╗ ██╔╝
         ███████║██████╔╝██║█████╗█████╗  ██║██║     ██╔████╔██║███████║█████╗  █████╗  ██║██╔██╗ ██║██║   ██║    ╚████╔╝ 
         ██╔══██║██╔═══╝ ██║╚════╝██╔══╝  ██║██║     ██║╚██╔╝██║██╔══██║██╔══╝  ██╔══╝  ██║██║╚██╗██║██║   ██║     ╚██╔╝  
         ██║  ██║██║     ██║      ██║     ██║███████╗██║ ╚═╝ ██║██║  ██║██║     ██║     ██║██║ ╚████║██║   ██║      ██║   
         ╚═╝  ╚═╝╚═╝     ╚═╝      ╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝      ╚═╝   

                                                      Carmelo Molero Castillo
                                                                       v${varEntorno.APP_VERSION}
                                                           `;

      this.logger.error(header);
   }
}
