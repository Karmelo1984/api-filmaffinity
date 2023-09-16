export interface SearchRequest {
   lang: 'es' | 'en';
   query: string;
}

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
