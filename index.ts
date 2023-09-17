import dotenv from 'dotenv';
dotenv.config();

if (!process.env.PORT) {
   console.error(
      `❌ Hay problemas leyendo las variables de entorno. NO se puede continuar, pare evitar posibles errores.`,
   );
   process.exit(1);
}

import logger from './src/logger';
import { app } from './src/server';

const PORT = process.env.PORT;
const URL = process.env.URL;

export async function main(): Promise<void> {
   const server = app.listen(PORT, () => {
      const url: string = `${URL}:${PORT}`;

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
