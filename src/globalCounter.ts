// Contador de peticiones request que está teniendo la aplicación

export let requestCounter: number = 0;
export function incrementRequestCounter() {
   requestCounter++;
}
