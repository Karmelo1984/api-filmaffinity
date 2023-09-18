# Release Notes

## [Versión 2.0.0] - Fecha de Lanzamiento (2023-Sept-10)

### Características Generales

-  Código reestructurado completamente, pasando de Javascript a Typescript.
-  Cambio de gestor de paquetes de npm a yarn.
-  Nuevo sistema de log. Ahora genera logs a la vez que da información por pantalla.

### Nuevas Características

-  [Issue ¿?]: Dockerfile optimizado para la creación de la imágen y contenedores.
-  [Issue ¿?]: Añadido sistema de logs con más información, tanto por terminal como en ficheros.
-  [Issue ¿?]: Remodelado de las peticiones a la API, con nueva funcionalidad.
   -  GET /api/search:
      -  lang `obligatorio`: Se acepta 'es' para las búsquedas en castellano y 'en' para las búsquedas en inglés.
      -  query `obligatorio`: Palabra a buscar,
      -  year `opcional`: Ayuda a afinar más la búsqueda, si sabemos el año de la pelicula/serie.
   -  GET /api/film:
      -  lang `obligatorio`: Se acepta 'es' para las búsquedas en castellano y 'en' para las búsquedas en inglés.
      -  id `obligatorio`: Id asignado por filmaffinity, a la película búscada,
   -  POST /api/film:
      -  url `obligatorio`: Dirección web de la película.
-  [Issue #1](https://github.com/Karmelo1984/api-filmaffinity/issues/1): Extraer información a partir de una URL de
   Filmaffinity.
-  [Issue #2](https://github.com/Karmelo1984/api-filmaffinity/issues/2): Añadir soporte para otros idiomas (actualmente
   'es' o 'en').
-  [Issue #3](https://github.com/Karmelo1984/api-filmaffinity/issues/3): Extraer la url de la imagen de la cartelera
   publicada en FilmAffinity.

### Deprecated

-  NO disponible petición GET (se ha actualizado): "http://localhost:3000/api/search?str=${pattern}"
-  NO disponible petición GET (se ha actualizado): "http://localhost:3000/api/film?id=${id}"

## [Versión 1.0.0] - Fecha de Lanzamiento (2023-Sept-10)

### Descripción Inicial

-  En esta versión inicial, [API-FILMAFFINITY] se lanza con las siguientes características clave:
   -  Desarrollado en Javascript.
   -  NodeJS 10.24.1.
   -  Gestor de paquetes 'npm'
   -  Búsqueda de películas por título.
   -  Obtención de datos de la película por ID en Filmaffinity.
