import dotenv from 'dotenv';
dotenv.config();

// Es importante cargar al inicio de la ejecución el paquete 'dotenv' para que esté disponible desde el principio
import { app } from './src/server';
import logger from './src/logger';

/**
 * Función principal para iniciar el servidor.
 *
 * @returns {Promise<void>} Una promesa que se resuelve cuando el servidor se inicia correctamente.
 */
export async function main(): Promise<void> {
   const PORT = process.env.PORT;
   const URL = process.env.URL;

   app.listen(PORT, () => {
      const url: string = `${URL}:${PORT}`;

      logger.info(`✅ El servidor se está ejecutando en: ${url}`);
   });
}

main();
