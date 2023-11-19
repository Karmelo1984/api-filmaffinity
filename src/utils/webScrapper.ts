import logger from '../logger';
import request from 'request-promise';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';

import { CustomError, handleError, createError } from '../types/CustomError';
import { SearchResponse } from '../types/Response/SearchResponse';
import { Persona, FilmResponse, Pais } from '../types/Response/FilmResponse';

import { FilmRequest } from '../types/Request/FilmRequest';
import { SearchRequest } from '../types/Request/SearchRequest';

import { varEntorno } from '../..';

const server: string = `${varEntorno.URL}:${varEntorno.PORT}`;

/**
 * Realiza una búsqueda en 'FilmAffinity' y devuelve una lista de resultados de búsqueda.
 *
 * @param {SearchRequest} search    - La solicitud de búsqueda que incluye el idioma y la consulta de búsqueda.
 * @returns {Promise<SearchResponse[] | CustomError>} - Una promesa que resuelve en una lista de resultados de búsqueda o un error personalizado.
 */
export async function getSearch(search: SearchRequest): Promise<SearchResponse[] | CustomError> {
   const functionName: string = 'getSearch';
   logger.info(`${functionName}  -->  START: ${JSON.stringify(search)}`);

   const url = `https://www.filmaffinity.com/${search.lang}/search.php?stype=title&stext=${encodeURIComponent(
      search.query,
   )}`;

   try {
      const result = await getSearchedFilms(url, search);

      logger.debug(`${functionName}  -->  END: ${JSON.stringify(result)}`);
      return result;
   } catch (error) {
      return handleError(logger, functionName, error);
   }
}

/**
 * Obtiene información detallada de una película en 'FilmAffinity' según su ID y idioma.
 *
 * @param {FilmRequest} film        - La solicitud de información de la película que incluye el idioma y el ID de la película.
 * @returns {Promise<FilmResponse | CustomError>} - Una promesa que resuelve en la información detallada de la película o un error personalizado.
 */
export async function getInfoFilm(film: FilmRequest): Promise<FilmResponse | CustomError> {
   const functionName: string = 'getInfoFilm';
   logger.info(`${functionName}  -->  START: ${JSON.stringify(film)}`);

   const url = film.url ? film.url : `https://www.filmaffinity.com/${film.lang}/film${film.id}.html`;

   try {
      const result = await getFilmInfoFromUrl(film.lang, url);

      logger.debug(`${functionName}  -->  END: ${JSON.stringify(result)}`);
      return result;
   } catch (error) {
      return handleError(logger, functionName, error, url);
   }
}

/**
 * Obtiene información detallada de una película a partir de la URL proporcionada.
 *
 * @param {string} url - La URL de la página de la película.
 * @param {string} lang - El idioma en el que se debe buscar la información (solo se permite, 'es' o 'en').
 * @returns {FilmResponse | CustomError} - Un objeto FilmResponse con la información de la película si la búsqueda tiene éxito,
 * o un objeto CustomError si ocurre un error durante la búsqueda.
 */
async function getFilmInfoFromUrl(lang: string, url: string): Promise<FilmResponse | CustomError> {
   const functionName: string = 'getFilmInfoFromUrl';
   logger.info(`${functionName}  -->  START: lang[${lang}] url[${url}]`);

   const isSpanish = lang === 'es';
   const quitarPalabrasDeGuion: string[] = ['Historia', 'Novela', 'Obra', 'Storyboard', 'Personajes', 'Videojuego'];
   const quitarPalabrasDeGenero: string[] = ['Productor', 'Producer', 'Distribuidora', 'Distributor'];
   const quitarPalabras = [...quitarPalabrasDeGenero, ...quitarPalabrasDeGuion];

   logger.debug(`${functionName}  -->  Palabras a quitar: ${quitarPalabras.join(', ')}`);

   try {
      const $ = await getPageHTML(url);

      const getTitle = () => {
         logger.debug(`${functionName}  -->  getTitle()`);
         const title = $('h1#main-title span[itemprop="name"]').text().trim();
         const originalTitle = getInnerText(isSpanish ? 'Título original' : 'Original title').replace(/aka$/, '');
         return { title, originalTitle };
      };

      const getPerson = (label: string) => {
         logger.debug(`${functionName}  -->  getPerson(${label})`);

         let person: Persona[] = [];
         const selectorDom: string =
            label === 'actor' ? `li[itemprop="${label}"], span[itemprop="${label}"]` : `span[itemprop="${label}"]`;

         logger.debug(`${functionName}  -->  getPerson(${label})       << ${selectorDom} >>`);

         $(selectorDom).each(function () {
            const hrefAttribute = $(this).find('a[itemprop="url"]').attr('href');
            const idActor = extractIdPersonaFromURL(hrefAttribute);
            const name = $(this).find('a[itemprop="url"]').attr('title');
            const photo = $(this).find('img').attr('src');

            if (name) {
               person.push({ id_persona: idActor, name: name.trim(), photo: photo });
            }
         });

         return person;
      };

      const cleanAndSplit = (label: string) => {
         logger.debug(`${functionName}  -->  cleanAndSplit(${label})`);

         const texto = getInnerText(label)
            .split(' | ')
            .map((data) =>
               data
                  .replace(/\;/g, ',')
                  .replace(/\./g, ',')
                  .replace(/ & /g, ',')
                  .replace(/ y /g, ',')
                  .replace(/, /g, ',')
                  .split(',')
                  .map((item) =>
                     item
                        .split(' ')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                        .trim(),
                  ),
            );

         const textoPulido = texto
            .flat()
            .filter((value) => value !== '' && !quitarPalabras.some((word) => value.includes(word)));

         return textoPulido;
      };

      const getInnerText = (label: string) => {
         logger.debug(`${functionName}  -->  getInnerText(${label})`);

         return $('dt:contains("' + label + '")')
            .next('dd')
            .text()
            .replace(/\n/g, ' ') // Reemplaza saltos de línea por espacios
            .replace(/\s+/g, ' ') // Reemplaza múltiples espacios en blanco por uno solo
            .trim();
      };

      const extractPersonMovieInfo = (label: string): Persona[] => {
         logger.debug(`${functionName}  -->  extractPersonMovieInfo(${label})`);

         const data: Persona[] = [];

         $('dl.movie-info dt').each(function () {
            const term = $(this).text().trim();

            if (term === label) {
               const items = $(this).next('dd').find('a');
               items.each(function () {
                  const href = $(this).attr('href');
                  const title = $(this).attr('title');

                  data.push({
                     id_persona: extractIdPersonaFromURL(href),
                     name: title?.trim() || '',
                     photo: undefined,
                  });
               });

               // Salir del bucle después de encontrar el 'label
               return false;
            }
         });

         return data;
      };

      const extractCountry = (label: string): Pais[] => {
         logger.debug(`${functionName}  -->  extractCountry(${label})`);

         const data: Pais[] = [];

         $('dl.movie-info dt').each(function () {
            const term = $(this).text().trim();
            if (term === label) {
               const items = $(this).next('dd').find('img');
               items.each(function () {
                  const src = $(this).attr('src');
                  const alt = $(this).attr('alt');

                  data.push({
                     id: src?.match(/\/countries2\/([A-Z]{2})\.png/)?.[1],
                     name: alt,
                     photo: `https://www.filmaffinity.com${src}`,
                  });
               });

               // Salir del bucle después de encontrar el 'label
               return false;
            }
         });
         return data;
      };

      const result: FilmResponse = {
         id_film: extractIdFilmFromURL(url),
         ...getTitle(),
         year: parseInt(getInnerText(isSpanish ? 'Año' : 'Year'), 10),
         duration_min: parseInt(getInnerText(isSpanish ? 'Duración' : 'Running time'), 10),
         synopsis: getInnerText(isSpanish ? 'Sinopsis' : 'Synopsis').replace(/ \(FILMAFFINITY\)/g, ''),
         rating: parseFloat($('#movie-rat-avg').attr('content') || '0'),
         votes: parseInt($('#movie-count-rat span[itemprop="ratingCount"]').attr('content') || '0', 10),
         image: $('img[itemprop="image"]').attr('src') || '',
         nationality: extractCountry(isSpanish ? 'País' : 'Country'),
         directedBy: getPerson('director'),
         cast: getPerson('actor'),
         screenplay: extractPersonMovieInfo(isSpanish ? 'Guion' : 'Screenwriter'),
         music: extractPersonMovieInfo(isSpanish ? 'Música' : 'Music'),
         photography: extractPersonMovieInfo(isSpanish ? 'Fotografía' : 'Cinematography'),
         studio: cleanAndSplit(isSpanish ? 'Compañías' : 'Producer'),
         genre: cleanAndSplit(isSpanish ? 'Género' : 'Genre'),
      };

      logger.debug(`${functionName}  -->  END: ${JSON.stringify(result)}`);
      return result;
   } catch (error) {
      return handleError(logger, functionName, error);
   }
}

/**
 * Comprueba si es una película o el portal de búsqueda de 'FilmAffinity'.
 *
 * @param {CheerioAPI} $   - Un objeto Cheerio que representa la página web.
 * @returns {boolean}      - `true` si el elemento es una busqueda, o false si es una película.
 * @throws {Error}         - Lanza un error si ocurre un problema durante la verificación del título.
 */
function checkTitleForBusqueda($: CheerioAPI): boolean {
   const functionName: string = 'checkTitleForBusqueda';
   logger.info(`${functionName}  -->  START: $[${$.html}]`);

   try {
      const pageTitle = $('head title').text();

      // Verifica si el título comienza con "Búsqueda de"
      const isSearch = pageTitle.startsWith('Búsqueda de "') || pageTitle.startsWith('Search for "');

      logger.debug(`${functionName}  -->  END: ${isSearch ? 'Es una búsqueda' : 'Es una película'}`);
      return isSearch;
   } catch (error) {
      throw handleError(logger, functionName, error);
   }
}

/**
 * Carga una página web y devuelve un objeto Cheerio que representa el contenido de la página.
 *
 * @param {string} url              - La URL de la página web a cargar.
 * @returns {Promise<CheerioAPI>}   - Un objeto Cheerio que representa el contenido de la página web cargada.
 * @throws {CustomError}            - Lanza un error personalizado si ocurre un error durante la carga de la página o la solicitud.
 */
async function getPageHTML(url: string): Promise<CheerioAPI> {
   const functionName: string = 'getPageHTML';
   logger.info(`${functionName}  -->  START:  url[${url}]`);

   try {
      const body = await request({
         method: 'GET',
         uri: url,
      });

      logger.debug(`${functionName}  -->  END:  url[${url}]`);
      return cheerio.load(body);
   } catch (error) {
      throw handleError(logger, functionName, error);
   }
}

/**
 * Obtiene una lista de películas según una solicitud de búsqueda.
 *
 * @param {string} url              - La URL de la página web que contiene los resultados de la búsqueda.
 * @param {SearchRequest} search    - La solicitud de búsqueda que contiene información sobre el idioma y otros detalles.
 * @returns {Promise<SearchResponse[] | CustomError>} Una promesa que resuelve en un arreglo de resultados de búsqueda o un objeto de error personalizado.
 */
async function getSearchedFilms(url: string, search: SearchRequest): Promise<SearchResponse[] | CustomError> {
   const functionName: string = 'getSearchedFilms';
   logger.info(`${functionName}  -->  START:  url[${JSON.stringify(search)}}]`);

   try {
      const result: SearchResponse[] = [];
      const $ = await getPageHTML(url);
      const isBusqueda = checkTitleForBusqueda($);
      const anyo_buscado = search.year ?? 0;

      if (isBusqueda) {
         logger.debug(`${functionName}  -->  DESDE BÚSQUEDA: ${url}`);

         $('.se-it.mt').each(function () {
            const anyo_encontrado = parseInt($(this).find('.ye-w').text(), 10);

            // anyo_buscado > 0 significa que queremos encontrar la película de ese año
            // por tanto, en ese caso, no queremos las que anyo_encontrado !== anyo_encontrado
            if (anyo_buscado > 0 && anyo_buscado != anyo_encontrado) {
               return;
            }
            const enlace = $(this).find('.mc-title a').attr('href');

            // Si enlace es undefined, NO hay un enlace válido, no se ha ejecutado correctamente la búsqueda
            if (enlace === undefined) {
               return;
            }
            const id = extractIdFilmFromURL(enlace);
            const lang = enlace.match(/\/([a-z]{2})\//)![1];

            const nota = $(this).find('.avgrat-box').text().trim().replace(',', '.');
            const votos = $(this).find('.ratcount-box').text().trim().replace('.', '').replace(',', '');

            result.push({
               id_film: id,
               title: $(this).find('.mc-title a').text().trim(),
               year: anyo_encontrado,
               rating: nota !== undefined ? parseFloat(nota) : 0,
               votes: votos !== undefined ? parseInt(votos, 10) : 0,
               link: enlace,
               api: `${server}/api/film?lang=${lang}&id=${id}`,
            });
         });
      } else {
         logger.debug(`${functionName}  -->  DESDE PELÍCULA: ${url}`);

         const anyo_encontrado = parseInt(getTextFromCheerioAPI($, search.lang == 'es', 'Año', 'Year'), 10);

         const enlace = $('meta[property="og:url"]').attr('content') || '';
         const matchResult = extractIdFilmFromURL(enlace);

         if (matchResult === null || matchResult < 0 || (anyo_buscado > 0 && anyo_buscado != anyo_encontrado)) {
            return createError(logger, functionName, 'Sin coincidencias con estos parámetros', 404, url);
         }

         const lang = enlace.match(/\/([a-z]{2})\//)![1];
         const nota = $('#movie-rat-avg').attr('content');
         const votos = $('#movie-count-rat span[itemprop="ratingCount"]').attr('content');

         result.push({
            id_film: matchResult,
            title: $('h1#main-title span[itemprop="name"]').text().trim(),
            year: anyo_encontrado,
            rating: nota !== undefined ? parseFloat(nota) : 0,
            votes: votos !== undefined ? parseInt(votos, 10) : 0,
            link: enlace,
            api: `${server}/api/film?lang=${lang}&id=${matchResult}`,
         });
      }
      if (result.length === 0) {
         return createError(
            logger,
            functionName,
            'La API no ha podido generar un JSON ¿el año indicado es correcto?',
            404,
            url,
         );
      }

      logger.debug(`${functionName}  -->  END:  url[${JSON.stringify(search)}}]`);
      return result;
   } catch (error) {
      throw handleError(logger, functionName, error);
   }
}

/**
 * Extrae el ID de una película desde una URL.
 *
 * @param {string} url - La URL de la película.
 * @return {number} El ID de la película si se encuentra en la URL, o -1 si no se encuentra.
 */
function extractIdFilmFromURL(url: string = ''): number {
   //logger.debug(`extractIdFilmFromURL  -->  url: ${url}`);

   const filmIdRegex = /film(\d+)\.html/;
   return extractIdFromURL(url, filmIdRegex);
}

/**
 * Extrae el ID de un actor desde una URL.
 *
 * @param {string} url - La URL del actor.
 * @return {number} El ID del actor si se encuentra en la URL, o -1 si no se encuentra.
 */
function extractIdPersonaFromURL(url: string = ''): number {
   //logger.debug(`extractIdPersonaFromURL  -->  url: ${url}`);

   const actorIdRegex = /name-id=(\d+)/;
   return extractIdFromURL(url, actorIdRegex);
}

/**
 * Extrae el ID de una URL dada utilizando una expresión regular.
 *
 * @param {string} url - La URL de la que se extraerá el ID.
 * @param {RegExp} regex - La expresión regular que coincide con el ID en la URL.
 * @return {number} El ID si se encuentra en la URL, o -1 si no se encuentra.
 */
function extractIdFromURL(url: string, regex: RegExp): number {
   const functionName: string = 'extractIdFromURL';
   logger.info(`${functionName}  -->  START:     ${url}     -     ${regex}`);

   const match = url.match(regex);

   let id: number = -1;

   if (match) {
      id = parseInt(match[1], 10);
   }

   logger.debug(`${functionName}  -->  END:     ${id}`);
   return id;
}

/**
 * Obtiene texto de un objeto Cheerio considerando el idioma y el valor de contexto proporcionados.
 *
 * @param {CheerioAPI} cheerio      - Un objeto Cheerio que representa el contenido de la página web.
 * @param {boolean} inSpanish       - Indica si la búsqueda es en castellano o en inglés.
 * @param {string} esValue          - El valor del contexto en español.
 * @param {string} enValue          - El valor del contexto en inglés.
 * @returns {string}                - El texto obtenido del objeto Cheerio, con saltos de línea eliminados y espacios extra recortados.
 */
function getTextFromCheerioAPI(cheerio: CheerioAPI, inSpanish: boolean, esValue: string, enValue: string): string {
   const functionName: string = 'getTextFromCheerioAPI';
   const parse = `dt:contains("${inSpanish ? esValue : enValue}")`;
   logger.info(`${functionName}  -->  START:  parse[${parse}]`);

   const result = cheerio(`${parse}`).next().text().replace(/\n/g, ' ').trim();

   logger.debug(`${functionName}  -->  START:  parse[${parse}]`);
   return result;
}
