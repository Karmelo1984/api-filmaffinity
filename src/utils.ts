/**
 * Encuentra las propiedades con valores `undefined` en un objeto y devuelve sus nombres en un array.
 *
 * @param obj - El objeto en el que buscar propiedades `undefined`.
 * @returns Un array de strings que contiene los nombres de las propiedades con valores `undefined`.
 */
export function findUndefinedProperties(obj: Record<string, any>): string[] {
   const propKeys = Object.keys(obj);
   const propValues = Object.values(obj);

   const undefinedVariables: string[] = [];

   for (let i = 0; i < propValues.length; i++) {
      if (propValues[i] === undefined) {
         undefinedVariables.push(propKeys[i]);
      }
   }

   return undefinedVariables;
}
