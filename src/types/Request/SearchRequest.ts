export interface SearchRequest {
   lang: 'es' | 'en';
   query: string;
   year: number | null;
}

/**
 * Valida una solicitud de búsqueda según el idioma especificado.
 *
 * @param {SearchRequest} search    - El objeto de solicitud de búsqueda que se va a validar.
 * @returns {Object} Un objeto con información sobre la validez de la solicitud.
 * @property {boolean} isValid      - Indica si la solicitud es válida (true) o no (false).
 * @property {number} statusCode    - El código de estado que indica la validez de la solicitud (200 para válida, 400 para inválida).
 * @property {string} message       - Un mensaje descriptivo que explica el resultado de la validación.
 * @throws {Error} Lanza un error si el objeto de solicitud de búsqueda no es válido.
 */
export function validateSearchRequest(search: SearchRequest): {
   isValid: boolean;
   statusCode: number;
   message: string;
} {
   const values: string[] = ['es', 'en'];

   if (values.includes(search.lang)) {
      return { isValid: true, statusCode: 200, message: 'La solicitud es válida.' };
   } else {
      return {
         isValid: false,
         statusCode: 400,
         message: `La propiedad lang (${search.lang}) no es válida. Solo se admiten los valores [${values}].`,
      };
   }
}
