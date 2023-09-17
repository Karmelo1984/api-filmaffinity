# Release Notes

## [Versión 2.0.0] - Fecha de Lanzamiento (YYYY-MM-DD)

### Características Generales

-  Código reestructurado completamente, pasando de Javascript a Typescript.
-  Cambio de gestor de paquetes de npm a yarn.
-  Nuevo sistema de log. Ahora genera logs a la vez que da información por pantalla.

### Nuevas Características

-  [Issue #1](https://github.com/Karmelo1984/api-filmaffinity/issues/1): Extraer información a partir de una URL válida
   de Filmaffinity.
-  [Issue #2](https://github.com/Karmelo1984/api-filmaffinity/issues/2): Añadir soporte para otros idiomas.
-  [Issue #3](https://github.com/Karmelo1984/api-filmaffinity/issues/3): Extraer la url de la imagen de FilmAffinity.

### Deprecated

-  Para la búsqueda, ya no está disponible llamar a la API mediante GET con este patrón
   "http://localhost:3000/api/search?str=${titulo de la pelicula}"
-  Para la descarga de información, ya no está disponible llamar a la API mediante GET con este patrón
   "http://localhost:3000/api/film?id=${id}"

## [Versión 1.0.0] - Fecha de Lanzamiento (2023-Sept-10)

### Descripción Inicial

-  En esta versión inicial, [API-FILMAFFINITY] se lanza con las siguientes características clave:
   -  Desarrollado en Javascript.
   -  NodeJS 10.24.1.
   -  Gestor de paquetes 'npm'
   -  Búsqueda de películas por título.
   -  Obtención de datos de la película por ID en Filmaffinity.
