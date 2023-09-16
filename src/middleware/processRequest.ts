import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para procesar la solicitud HTTP y almacenar datos relevantes en la variable local 'processedData' de la respuesta.
 *
 * Este middleware captura información sobre la solicitud, como el método HTTP, los parámetros de consulta, los parámetros de ruta y el cuerpo.
 * Luego, almacena estos datos en la variable local 'processedData' de la respuesta 'res.locals' para su posterior uso en las rutas manejadoras.
 *
 * @param {Request} req       - El objeto Request que representa la solicitud HTTP.
 * @param {Response} res      - El objeto Response que representa la respuesta HTTP.
 * @param {NextFunction} next - Función middleware para pasar la solicitud al siguiente middleware en la cadena.
 */
export function processRequest(req: Request, res: Response, next: NextFunction) {
   res.locals.processedData = {
      method: req.method,
      //ip: req.ip || req.connection.remoteAddress,
      //url: req.originalUrl,
      //protocolo: req.protocol,
      //headers: req.headers,
      //cookies: req.cookies,
      query: req.query,
      params: req.params,
      body: req.body,
   };

   // Llama a 'next()' si es necesario
   next();
}
