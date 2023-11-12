# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.1.0](https://github.com/Karmelo1984/api-filmaffinity/compare/v3.0.0...v3.1.0) (2023-11-12)


### Features

* **/api/film:** ahora extrae las imágenes de los actores ([6196da6](https://github.com/Karmelo1984/api-filmaffinity/commit/6196da629a311580589a39f1ebf96c7a735331a5)), closes [#10](https://github.com/Karmelo1984/api-filmaffinity/issues/10)
* **/api/search:** añadida puntuación de la película, y cantidad de votos, al apartado de búsqueda ([fb731ce](https://github.com/Karmelo1984/api-filmaffinity/commit/fb731ce47fddf77b4ac7b1be54e15a9c8c781405)), closes [#9](https://github.com/Karmelo1984/api-filmaffinity/issues/9)


### Bug Fixes

* **dockerfile:** solucionado error en la generación de la imagen de docker ([bbeac98](https://github.com/Karmelo1984/api-filmaffinity/commit/bbeac984fbf468380db0f0b6f9f8d39163f9ece8))

## [3.0.0](https://github.com/Karmelo1984/api-filmaffinity/compare/v2.0.2...v3.0.0) (2023-10-13)


### ⚠ BREAKING CHANGES

* **/api/search:** Se han cambiado completamente el contenido del objeto devuelto, ahora el nombre de
los campos aparecen en inglés para facilitar la integración con otras apis externas
* **/api/film:** Se han cambiado completamente el contenido del objeto devuelto, ahora el nombre de
los campos aparecen en inglés para facilitar la integración con otras apis externas

### Features

* **/api/film:** limpia el campo 'screenPlay' ([08d33d7](https://github.com/Karmelo1984/api-filmaffinity/commit/08d33d79338c9b045757140d0732487da45e880a)), closes [#7](https://github.com/Karmelo1984/api-filmaffinity/issues/7)
* **/api/search:** standariza la salida en ingles de los elementos de búsqueda ([d2f004e](https://github.com/Karmelo1984/api-filmaffinity/commit/d2f004eab1a7685a56696acba5b91baf0cc5e8ad))
* **search:** se ha añadido el elemento 'api' al resultado de la búsqueda ([5751b1e](https://github.com/Karmelo1984/api-filmaffinity/commit/5751b1ec6438898949419c15a8a4fa22da5600c6))
* **standardcommits:** añadida herramienta para poder estandarizar los commits ([8bc38cb](https://github.com/Karmelo1984/api-filmaffinity/commit/8bc38cb2265f7b970e3d16d2f19955d6d947d2ca)), closes [#8](https://github.com/Karmelo1984/api-filmaffinity/issues/8)
* **standardcommits:** añadida herramienta para poder estandarizar los commits ([8881b3d](https://github.com/Karmelo1984/api-filmaffinity/commit/8881b3d7cce826286f0e0aa67df10850178aaa80)), closes [#8](https://github.com/Karmelo1984/api-filmaffinity/issues/8)


### Bug Fixes

* **/api/film:** ahora si muestra correctamente el "Reparto" ([9d1e3d0](https://github.com/Karmelo1984/api-filmaffinity/commit/9d1e3d0218251e2d10790900f780d21d5c3d7438)), closes [#7](https://github.com/Karmelo1984/api-filmaffinity/issues/7)
