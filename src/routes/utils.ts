/**
 * Analiza el segundo nivel de un objeto y devuelve un array con los elementos deseados.
 *
 * @param {Record<string, any>} objeto    - El objeto a analizar.
 * @returns {string[]} Un array con los elementos del segundo nivel del objeto; de lo contrario un array vacío.
 */
export function extractSecondLevelElements(objeto: Record<string, any>): string[] {
   const elementosSegundoNivel = [];

   for (const key in objeto) {
      if (typeof objeto[key] === 'object' && objeto[key] !== null) {
         for (const subKey in objeto[key]) {
            elementosSegundoNivel.push(subKey);
         }
      }
   }
   console.log('elementosSegundoNivel: ' + elementosSegundoNivel);
   return elementosSegundoNivel;
}

/**
 * Comprueba si todos los elementos de un array están presentes en otro array.
 *
 * @param {string[]} elementos            - Array de elementos a verificar.
 * @param {string[]} array                - Array contra el que se debe comprobar.
 * @returns {boolean} `true` si todos los elementos están en el array; de lo contrario, `false`.
 */
export function hasOnlyValidParams(elementos: string[], array: string[]): boolean {
   return elementos.every((element) => array.includes(element));
}
