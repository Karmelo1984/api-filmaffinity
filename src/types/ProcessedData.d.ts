export interface ProcessedData {
   id_request: number;
   method: req.method;
   //ip: req.ip || req.connection.remoteAddress,
   //url: req.originalUrl,
   //protocolo: req.protocol,
   //headers: req.headers,
   //cookies: req.cookies,
   query: req.query;
   params: req.params;
   body: req.body;
}
