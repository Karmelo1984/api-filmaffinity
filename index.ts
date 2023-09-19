import dotenv from 'dotenv';
dotenv.config();
import { findUndefinedProperties } from './src/utils';

export const varEntorno = {
   VERSION: process.env.VERSION ?? 'v2.0.1',
   PORT: process.env.PORT,
   URL: process.env.URL ?? 'http://localhost',
   PATH_LOG: process.env.PATH_LOG ?? 'logs',
   LOG_NAME: process.env.LOG_NAME,
   HEAD_LEN: parseInt(process.env.HEAD_LEN ?? '26'),
};

const undefinedVariables: string[] = findUndefinedProperties(varEntorno);

if (undefinedVariables.length > 0) {
   console.error(`❌ Las siguientes variables de entorno no están definidas [${undefinedVariables.join(', ')}]`);
   console.error(`❌ NO se puede continuar, para evitar posibles errores.`);
   process.exit(1);
}

import logger from './src/logger';
import { app } from './src/server';

export async function main(): Promise<void> {
   const server = app.listen(varEntorno.PORT, () => {
      const url: string = `${varEntorno.URL}:${varEntorno.PORT}`;

      logger.info(`✅ El servidor se está ejecutando en: ${url}`);
   });

   server.on('error', (error: any) => {
      logger.info(`❌ Error al iniciar el servidor: ${error.message}`);
      server.close(() => {
         process.exit(1); // Salir de la aplicación con un código de error
      });
   });
}

main();
