import dotenv from 'dotenv';
dotenv.config();
import { findUndefinedProperties } from './src/utils';

import * as fs from 'fs';
import * as path from 'path';

const packageJsonPath = path.join(__dirname, 'package.json'); // Ruta al package.json

try {
   const data = fs.readFileSync(packageJsonPath, 'utf8');
   const packageJson = JSON.parse(data);
   const version = packageJson.version;

   // Configura la variable de entorno con la versión
   process.env.APP_VERSION = version;

   console.log(`Versión de la aplicación: ${version}`);
} catch (error) {
   console.error('❌ Error al leer o analizar el archivo package.json:', error);
   process.exit(1);
}

export const varEntorno = {
   APP_VERSION: process.env.APP_VERSION,
   PORT: process.env.PORT,
   URL: process.env.URL ?? 'http://localhost',
   PATH_LOG: process.env.PATH_LOG ?? 'logs',
   LOG_NAME: process.env.LOG_NAME,
   HEAD_LEN: parseInt(process.env.HEAD_LEN ?? '26'),
};

const undefinedVariables: string[] = findUndefinedProperties(varEntorno);

if (undefinedVariables.length > 0) {
   console.error(`❌ Las siguientes variables de entorno no están definidas [${undefinedVariables.join(', ')}]`);
   console.error(`❌ Para evitar posibles errores de inconsistencia, NO se puede continuar.`);
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
