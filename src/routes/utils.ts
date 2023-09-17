/**
 * Comprueba si un objeto y sus propiedades (recursivamente) contienen solo propiedades permitidas.
 *
 * @param {Record<string, any>} objeto  - El objeto a verificar.
 * @param {string[]} propPerm           - Un array de strings que contiene las propiedades permitidas.
 * @returns {boolean} `true` si todas las propiedades son válidas; de lo contrario, `false`.
 */
export function hasOnlyValidParams(objeto: Record<string, any>, propPerm: string[]): boolean {
   const propObjet = Object.keys(objeto);

   const noPermitidas = propObjet.filter((propiedad) => {
      if (typeof objeto[propiedad] === 'object' && objeto[propiedad] !== null) {
         if (!hasOnlyValidParams(objeto[propiedad], propPerm)) {
            return true; // Detiene la ejecución si la recursión devuelve true
         }
      } else {
         if (!propPerm.includes(propiedad)) {
            return true; // Detiene la ejecución si encuentra una propiedad no permitida
         }
      }

      return false; // Continúa la ejecución si la propiedad es permitida
   });

   return noPermitidas.length === 0;
}
