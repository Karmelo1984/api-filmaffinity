import logger from '../logger';
import request from 'request-promise';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';

import { CustomError, handleError, createError } from '../types/CustomError';
import { SearchResponse } from '../types/Response/SearchResponse';
import { FilmResponse } from '../types/Response/FilmResponse';

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
   logger.info(`getSearch  -->  search: ${JSON.stringify(search)}`);

   const url = `https://www.filmaffinity.com/${search.lang}/search.php?stype=title&stext=${encodeURIComponent(
      search.query,
   )}`;

   try {
      logger.debug(`getSearch  -->  url: ${url}`);
      const result = await getSearchedFilms(url, search);

      return result;
   } catch (error) {
      return handleError(logger, 'getSearch', error);
   }
}

/**
 * Obtiene información detallada de una película en 'FilmAffinity' según su ID y idioma.
 *
 * @param {FilmRequest} film        - La solicitud de información de la película que incluye el idioma y el ID de la película.
 * @returns {Promise<FilmResponse | CustomError>} - Una promesa que resuelve en la información detallada de la película o un error personalizado.
 */
export async function getInfoFilm(film: FilmRequest): Promise<FilmResponse | CustomError> {
   logger.info(`getInfoFilm  -->  film: ${JSON.stringify(film)}`);

   const url = film.url ? film.url : `https://www.filmaffinity.com/${film.lang}/film${film.id}.html`;

   try {
      return await getFilmInfoFromUrl(film.lang, url);
   } catch (error) {
      return handleError(logger, 'getInfoFilm', error, url);
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
   logger.info(`getFilmInfoFromUrl  -->  url: ${url}`);

   const inSpanish = lang === 'es';

   const palabrasClave: string[] = ['Historia', 'Novela', 'Obra', 'Storyboard', 'Personajes', 'Videojuego'];

   logger.debug(`getFilmInfoFromUrl  -->  palabrasClave: ${palabrasClave}`);

   try {
      const $ = await getPageHTML(url);

      const titulo = $('h1#main-title span[itemprop="name"]').text().trim();

      let reparto = $('li[itemprop="actor"]')
         .map(function () {
            const title = $(this).find('a[itemprop="url"]').attr('title');
            return title ? title.trim() : ''; // Comprobación de nulidad y valor predeterminado
         })
         .get()
         .join(' | ');
      if (!reparto) {
         reparto = arrayToTextFromCheerioAPI($, inSpanish, 'Reparto', 'Cast', 'span[itemprop="actor"] a');
      }

      const nota = $('#movie-rat-avg').attr('content');
      const votos = $('#movie-count-rat span[itemprop="ratingCount"]').attr('content');

      const result: FilmResponse = {
         title: titulo,
         originalTitle: getTextFromCheerioAPI($, inSpanish, 'Título original', 'Original title').replace(/aka$/, ''),
         year: parseInt(getTextFromCheerioAPI($, inSpanish, 'Año', 'Year'), 10),
         duration: getTextFromCheerioAPI($, inSpanish, 'Duración', 'Running time'),
         sinopsys: getTextFromCheerioAPI($, inSpanish, 'Sinopsis', 'Synopsis').replace(/ \(FILMAFFINITY\)/g, ''),
         genre: arrayToTextFromCheerioAPI($, inSpanish, 'Género', 'Genre', 'span[itemprop="genre"] a').replaceAll(
            ', ',
            ' | ',
         ),
         rating: nota !== undefined ? parseFloat(nota) : 0,
         votes: votos !== undefined ? parseInt(votos, 10) : 0,
         image: $('img[itemprop="image"]').attr('src') ?? '',
         nationality: getTextFromCheerioAPI($, inSpanish, 'País', 'Country').replaceAll(', ', ' | '),
         directedBy: limpiarTexto(
            getTextFromCheerioAPI($, inSpanish, 'Dirección', 'Director'),
            palabrasClave,
         ).replaceAll(', ', ' | '),
         screenplay: limpiarTexto(
            getTextFromCheerioAPI($, inSpanish, 'Guion', 'Screenwriter'),
            palabrasClave,
         ).replaceAll(', ', ' | '),
         cast: reparto,
         music: getTextFromCheerioAPI($, inSpanish, 'Música', 'Music').replaceAll(', ', ' | '),
         photography: getTextFromCheerioAPI($, inSpanish, 'Fotografía', 'Cinematography').replaceAll(', ', ' | '),
         studio: arrayToTextFromCheerioAPI($, inSpanish, 'Compañías', 'Producer', 'a'),
      };

      return result;
   } catch (error) {
      return handleError(logger, 'getFilmInfoFromUrl', error);
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
   logger.info(`checkTitleForBusqueda  -->  $: ${$.html()}`);

   try {
      const pageTitle = $('head title').text();

      // Verifica si el título comienza con "Búsqueda de"
      const isSearch = pageTitle.startsWith('Búsqueda de "') || pageTitle.startsWith('Search for "');

      logger.debug(`checkTitleForBusqueda  -->  ${isSearch ? 'Se trata de una búsqueda' : 'Se trata de una película'}`);
      return isSearch;
   } catch (error) {
      throw handleError(logger, 'checkTitleForBusqueda', error);
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
   logger.info(`getPageHTML  -->  url: ${url}`);

   try {
      const body = await request({
         method: 'GET',
         uri: url,
      });

      return cheerio.load(body);
   } catch (error) {
      throw handleError(logger, 'getPageHTML', error);
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
   logger.info(`getSearchedFilms  -->  url: ${JSON.stringify(search)}`);

   try {
      const result: SearchResponse[] = [];
      const $ = await getPageHTML(url);
      const isBusqueda = checkTitleForBusqueda($);
      const anyo_buscado = search.year ?? 0;

      if (isBusqueda) {
         logger.debug(`getSearchedFilms  -->  Extrayendo datos de la búsqueda: ${url}`);

         $('.se-it.mt').each(function () {
            const anyo_encontrado = parseInt($(this).find('.ye-w').text(), 10);

            // anyo_buscado > 0 significa que queremos encontrar la película de ese año
            // por tanto, en ese caso, no queremos las que anyo_encontrado !== anyo_encontrado
            if (anyo_buscado > 0 && anyo_buscado != anyo_encontrado) {
               return;
            }
            const enlace = $(this).find('.mc-title a').attr('href');

            // Si enlace es undefinned, NO hay un enlace válido, no se ha ejecutado correctamente la búsqueda
            if (enlace === undefined) {
               return;
            }
            const id = enlace.match(/film(\d+)\.html/)![1];
            const lang = enlace.match(/\/([a-z]{2})\//)![1];

            const nota = $(this).find('.avgrat-box').text().trim().replace(',', '.');
            const votos = $(this).find('.ratcount-box').text().trim().replace('.', '').replace(',', '');

            result.push({
               id: parseInt(id, 10),
               title: $(this).find('.mc-title a').text().trim(),
               year: anyo_encontrado,
               rating: nota !== undefined ? parseFloat(nota) : 0,
               votes: votos !== undefined ? parseInt(votos, 10) : 0,
               link: enlace,
               api: `${server}/api/film?lang=${lang}&id=${parseInt(id, 10)}`,
            });
         });
      } else {
         logger.debug(`getSearchedFilms  -->  Extrayendo datos de la película: ${url}`);

         const anyo_encontrado = parseInt(getTextFromCheerioAPI($, search.lang == 'es', 'Año', 'Year'), 10);

         const enlace = $('meta[property="og:url"]').attr('content') || '';
         const matchResult = enlace.match(/film(\d+)\.html/);

         if (matchResult === null || (anyo_buscado > 0 && anyo_buscado != anyo_encontrado)) {
            return createError(logger, 'getSearchedFilms', 'Sin coincidencias con estos parámetros', 404, url);
         }

         const lang = enlace.match(/\/([a-z]{2})\//)![1];
         const nota = $('#movie-rat-avg').attr('content');
         const votos = $('#movie-count-rat span[itemprop="ratingCount"]').attr('content');

         result.push({
            id: parseInt(matchResult[1], 10),
            title: $('h1#main-title span[itemprop="name"]').text().trim(),
            year: anyo_encontrado,
            rating: nota !== undefined ? parseFloat(nota) : 0,
            votes: votos !== undefined ? parseInt(votos, 10) : 0,
            link: enlace,
            api: `${server}/api/film?lang=${lang}&id=${parseInt(matchResult[1], 10)}`,
         });
      }
      if (result.length === 0) {
         return createError(
            logger,
            'getSearchedFilms',
            'La API no ha podido generar un JSON ¿el año indicado es correcto?',
            404,
            url,
         );
      }
      return result;
   } catch (error) {
      throw handleError(logger, 'getSearchedFilms', error);
   }
}

/**
 * Extrae datos de una página web utilizando Cheerio.
 *
 * @param {CheerioAPI} cheerio      - La instancia de Cheerio que representa la página web.
 * @param {boolean} inSpanish       - Indica si se debe buscar en español o en inglés.
 * @param {string} esValue          - El valor en español para buscar en la página.
 * @param {string} enValue          - El valor en inglés para buscar en la página.
 * @param {string} toSearch         - El selector CSS para buscar los elementos deseados.
 * @returns {string} Una cadena que contiene los datos extraídos separados por '|' o una cadena vacía si no se encuentran datos.
 */
function arrayToTextFromCheerioAPI(
   cheerio: CheerioAPI,
   inSpanish: boolean,
   esValue: string,
   enValue: string,
   toSearch: string,
) {
   const parse = `dt:contains("${inSpanish ? esValue : enValue}")`;

   logger.debug(`arrayToTextFromCheerioAPI  -->  ${parse}`);

   return cheerio(`${parse}`)
      .next()
      .find(toSearch)
      .map(function () {
         return cheerio(this).text().trim() || '';
      })
      .get()
      .join(' | ');
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
   const parse = `dt:contains("${inSpanish ? esValue : enValue}")`;

   logger.debug(`getTextFromCheerioAPI  -->  ${parse}`);

   return cheerio(`${parse}`).next().text().replace(/\n/g, ' ').trim();
}

function limpiarTexto(texto: string, palabrasClave: string[]): string {
   // Utilizar una expresión regular para eliminar el texto que sigue a las palabras clave
   const palabrasClaveRegex = new RegExp(
      '(' + palabrasClave.map((palabra) => `\\s*\\.?\\s*${palabra}.*?`).join('|') + ')(?:\\.|$)',
      'g',
   );
   const textoLimpio = texto.replace(palabrasClaveRegex, '');
   return textoLimpio.trim();
}
