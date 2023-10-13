# Release Notes

All notable changes to this project will be documented in this file. See
[standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0](https://github.com/Karmelo1984/api-filmaffinity/releases/tag/v3.0.0) (2023-Oct-13)

### ⚠ BREAKING CHANGES

-  **/api/search:** Se han cambiado completamente el contenido del objeto devuelto, ahora el nombre de los campos
   aparecen en inglés para facilitar la integración con otras apis externas
-  **/api/film:** Se han cambiado completamente el contenido del objeto devuelto, ahora el nombre de los campos aparecen
   en inglés para facilitar la integración con otras apis externas

### Features

-  **/api/film:** limpia el campo 'screenPlay'
   ([08d33d7](https://github.com/Karmelo1984/api-filmaffinity/commit/08d33d79338c9b045757140d0732487da45e880a)), closes
   [#7](https://github.com/Karmelo1984/api-filmaffinity/issues/7)
-  **/api/search:** standariza la salida en ingles de los elementos de búsqueda
   ([d2f004e](https://github.com/Karmelo1984/api-filmaffinity/commit/d2f004eab1a7685a56696acba5b91baf0cc5e8ad))
-  **search:** se ha añadido el elemento 'api' al resultado de la búsqueda
   ([5751b1e](https://github.com/Karmelo1984/api-filmaffinity/commit/5751b1ec6438898949419c15a8a4fa22da5600c6))
-  **standardcommits:** añadida herramienta para poder estandarizar los commits
   ([8bc38cb](https://github.com/Karmelo1984/api-filmaffinity/commit/8bc38cb2265f7b970e3d16d2f19955d6d947d2ca)), closes
   [#8](https://github.com/Karmelo1984/api-filmaffinity/issues/8)
-  **standardcommits:** añadida herramienta para poder estandarizar los commits
   ([8881b3d](https://github.com/Karmelo1984/api-filmaffinity/commit/8881b3d7cce826286f0e0aa67df10850178aaa80)), closes
   [#8](https://github.com/Karmelo1984/api-filmaffinity/issues/8)

### Bug Fixes

-  **/api/film:** ahora si muestra correctamente el "Reparto"
   ([9d1e3d0](https://github.com/Karmelo1984/api-filmaffinity/commit/9d1e3d0218251e2d10790900f780d21d5c3d7438)), closes
   [#7](https://github.com/Karmelo1984/api-filmaffinity/issues/7)

## [2.0.1](https://github.com/Karmelo1984/api-filmaffinity/releases/tag/v2.0.1) (2023-Sept-18)

### Características Generales

-  Solucionado error en la carga de las variables de entorno, cuando se trata de un contenedor docker.

## [2.0.0](https://github.com/Karmelo1984/api-filmaffinity/releases/tag/v2.0.0) (2023-Sept-19)

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

## [1.0.0](https://github.com/Karmelo1984/api-filmaffinity/releases/tag/v1.0.0) (2023-Sept-10)

### Descripción Inicial

-  En esta versión inicial, [API-FILMAFFINITY] se lanza con las siguientes características clave:
   -  Desarrollado en Javascript.
   -  NodeJS 10.24.1.
   -  Gestor de paquetes 'npm'
   -  Búsqueda de películas por título.
   -  Obtención de datos de la película por ID en Filmaffinity.
