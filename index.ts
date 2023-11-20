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

   process.env.APP_VERSION = version;

   console.log(`Versión de la aplicación: ${version}`);
} catch (error) {
   console.error('❌ Error al leer o analizar el archivo package.json:', error);
   process.exit(1);
}

import { VariablesEntorno } from './src/types/VariablesEntorno';
export const varEntorno: VariablesEntorno = {
   APP_VERSION: process.env.APP_VERSION,
   PORT: parseInt(process.env.PORT ?? '3000'),
   URL: process.env.URL ?? 'http://localhost',
   LOG_PATH: process.env.PATH_LOG ?? 'logs',
   LOG_NAME: process.env.LOG_NAME ?? 'api-filmaffinity',
   LOG_HEAD_LEN: parseInt(process.env.HEAD_LEN ?? '26'),
};

const undefinedVariables: string[] = findUndefinedProperties(varEntorno);

if (undefinedVariables.length > 0) {
   console.error(`❌ Las siguientes variables de entorno no están definidas [${undefinedVariables.join(', ')}]`);
   console.error(`❌ Para evitar posibles errores de inconsistencia, NO se puede continuar.`);
   process.exit(1);
}

import { app } from './src/server';
import { Logger } from './src/models/Logger';

export async function main(): Promise<void> {
   const logger = Logger.getInstance();

   const server = app.listen(varEntorno.PORT, () => {
      const url: string = `${varEntorno.URL}:${varEntorno.PORT}`;

      logger.registerLog('info', 'app.main', 'START', NaN, `✅ El servidor se está ejecutando en: ${url}`);
   });

   server.on('error', (error: any) => {
      logger.registerLog('error', 'app.main', 'CATCH', NaN, `❌ Error al iniciar el servidor: ${error.message}`);

      server.close(() => {
         process.exit(1); // Salir de la aplicación con un código de error
      });
   });
}

main();
