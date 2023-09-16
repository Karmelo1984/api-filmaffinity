import logger from '../logger';
import request = require('request-promise');
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';

import { CustomError } from '../types/CustomError';
import { SearchResponse } from '../types/Response/SearchResponse';
import { FilmResponse } from '../types/Response/FilmResponse';

import { FilmRequest } from '../types/Request/FilmRequest';
import { SearchRequest } from '../types/Request/SearchRequest';

const HEAD_LEN = parseInt(process.env.HEAD_LEN ?? '0', 10);

/**
 * Realiza una búsqueda en 'FilmAffinity' y devuelve una lista de resultados de búsqueda.
 *
 * @param {SearchRequest} search    - La solicitud de búsqueda que incluye el idioma y la consulta de búsqueda.
 * @returns {Promise<SearchResponse[] | CustomError>} - Una promesa que resuelve en una lista de resultados de búsqueda o un error personalizado.
 * @throws {CustomError}            - Lanza un error personalizado si ocurre un error durante la búsqueda.
 */
export async function getSearch(search: SearchRequest): Promise<SearchResponse[] | CustomError> {
   logger.info(`[${'getSearch'.padEnd(HEAD_LEN, ' ')}]  -->  search: ${JSON.stringify(search)}`);

   const url = `https://www.filmaffinity.com/${search.lang}/search.php?stype=title&stext=${encodeURIComponent(
      search.query,
   )}`;

   logger.debug(`[${'getSearch'.padEnd(HEAD_LEN, ' ')}]  -->  url: ${url}`);

   try {
      const $ = await cargarPagina(url);

      const result: SearchResponse[] = [];
      if (checkTitleForBusqueda($)) {
         $('.se-it.mt').each(function () {
            const enlace = $(this).find('.mc-title a').attr('href');
            if (enlace === undefined) {
               // Si enlace es undefined, salta a la siguiente iteración del bucle
               return;
            }
            const id = enlace.match(/film(\d+)\.html/)![1];

            result.push({
               id: parseInt(id, 10),
               titulo: $(this).find('.mc-title a').text().trim(),
               anyo: parseInt($(this).find('.ye-w').text(), 10),
               link: enlace,
            });
         });
      } else {
         const enlace = $('meta[property="og:url"]').attr('content') || '';
         const matchResult = enlace.match(/film(\d+)\.html/);

         if (matchResult === null) {
            const msg = 'Film not found';
            logger.error(`[${'getSearch'.padEnd(HEAD_LEN, ' ')}]  -->  ${msg}`);

            const customError: CustomError = {
               statusCode: 404,
               message: msg,
            };

            return customError;
         }

         result.push({
            id: parseInt(matchResult[1], 10),
            titulo: $('h1#main-title span[itemprop="name"]').text().trim(),
            anyo: parseInt(getTextFromCheerioAPI($, search.lang, 'Año', 'Year'), 10),
            link: enlace,
         });
      }

      return result;
   } catch (error) {
      const msg = (error as any).message;
      logger.error(`[${'getSearch'.padEnd(HEAD_LEN, ' ')}]  -->  ${msg}`);

      const customError: CustomError = {
         statusCode: (error as any).statusCode,
         message: msg,
         body: (error as any).response ? (error as any).response.body : undefined,
      };

      throw customError;
   }
}

/**
 * Obtiene información detallada de una película en 'FilmAffinity' según su ID y idioma.
 *
 * @param {FilmRequest} film        - La solicitud de información de la película que incluye el idioma y el ID de la película.
 * @returns {Promise<FilmResponse | CustomError>} - Una promesa que resuelve en la información detallada de la película o un error personalizado.
 * @throws {CustomError}            - Lanza un error personalizado si ocurre un error durante la obtención de información de la película.
 */
export async function getInfoFilm(film: FilmRequest): Promise<FilmResponse | CustomError> {
   logger.info(`[${'getInfoFilm'.padEnd(HEAD_LEN, ' ')}]  -->  film: ${JSON.stringify(film)}`);

   const url = `https://www.filmaffinity.com/${film.lang}/film${film.id}.html`;

   try {
      return await getFilmInfoFromUrl(film.lang, url);
   } catch (error) {
      return {
         statusCode: (error as any).statusCode,
         message: (error as any).body,
      };
   }
}

/**
 * Obtiene información detallada de una película a partir de la URL proporcionada.
 *
 * @param {string} url - La URL de la página de la película.
 * @param {string} lang - El idioma en el que se debe buscar la información (solo se permite, 'es' o 'en').
 * @returns {FilmResponse | CustomError} - Un objeto FilmResponse con la información de la película si la búsqueda tiene éxito,
 * o un objeto CustomError si ocurre un error durante la búsqueda.
 * @throws {CustomError} - Lanza un error personalizado si la búsqueda falla debido a un error en la solicitud o procesamiento de datos.
 */
async function getFilmInfoFromUrl(lang: string, url: string): Promise<FilmResponse | CustomError> {
   logger.debug(`[${'getFilmInfoFromUrl'.padEnd(HEAD_LEN, ' ')}]  -->  url: ${url}`);
   try {
      const $ = await cargarPagina(url);

      const titulo = $('h1#main-title span[itemprop="name"]').text().trim();

      const reparto = $('li[itemprop="actor"]')
         .map(function () {
            const title = $(this).find('a[itemprop="url"]').attr('title');
            return title ? title.trim() : ''; // Comprobación de nulidad y valor predeterminado
         })
         .get()
         .join(' | ');

      const generos = $(`dt:contains("${lang === 'es' ? 'Género' : 'Genre'}")`)
         .next()
         .find('span[itemprop="genre"] a')
         .map(function () {
            return $(this).text().trim();
         })
         .get()
         .join(' | '); // Unir los géneros en una cadena separada por '|'

      const companias = $(`dt:contains("${lang === 'es' ? 'Compañías' : 'Producer'}")`)
         .next()
         .find('a')
         .map(function () {
            return $(this).text().trim();
         })
         .get()
         .join(' | ');

      const nota = $('#movie-rat-avg').attr('content');
      const votos = $('#movie-count-rat span[itemprop="ratingCount"]').attr('content');

      const result: FilmResponse = {
         titulo: titulo,
         titulo_original: getTextFromCheerioAPI($, lang, 'Título original', 'Original title').replace(/aka$/, ''),
         anyo: parseInt(getTextFromCheerioAPI($, lang, 'Año', 'Year'), 10),
         duracion: getTextFromCheerioAPI($, lang, 'Duración', 'Running time'),
         pais: getTextFromCheerioAPI($, lang, 'País', 'Country'),
         direccion: getTextFromCheerioAPI($, lang, 'Dirección', 'Director'),
         guion: getTextFromCheerioAPI($, lang, 'Guion', 'Screenwriter').replace('.  Novela', ' | Novela'),
         reparto: reparto,
         musica: getTextFromCheerioAPI($, lang, 'Música', 'Music'),
         fotografia: getTextFromCheerioAPI($, lang, 'Fotografía', 'Cinematography'),
         companias: companias,
         genero: generos,
         sinopsis: getTextFromCheerioAPI($, lang, 'Sinopsis', 'Synopsis').replace(/ \(FILMAFFINITY\)/g, ''),
         nota: nota !== undefined ? parseFloat(nota) : 0,
         votos: votos !== undefined ? parseInt(votos, 10) : 0,
      };

      return result;
   } catch (error) {
      logger.error(`[${'getFilmInfoFromUrl'.padEnd(HEAD_LEN, ' ')}]  -->  ${(error as any).body.padEnd(40, '')}`);

      return {
         statusCode: (error as any).statusCode,
         message: (error as any).body,
      };
   }
}

/**
 * Verifica si la página web analizada es una página de búsqueda en 'FilmAffinity'.
 *
 * @param {CheerioAPI} $   - Un objeto Cheerio que representa la página web.
 * @returns {boolean}      - `true` si el elemento es una busqueda, o false si es una película.
 * @throws {Error}         - Lanza un error si ocurre un problema durante la verificación del título.
 */
function checkTitleForBusqueda($: CheerioAPI): boolean {
   logger.info(
      `[${'checkTitleForBusqueda'.padEnd(HEAD_LEN, ' ')}]  -->  $: ${$.html()
         .replace(/\s+/g, ' ')
         .trim()
         .slice(0, 75)}`,
   );

   try {
      const pageTitle = $('head title').text();

      // Verifica si el título comienza con "Búsqueda de"
      const isSearch = pageTitle.startsWith('Búsqueda de "') || pageTitle.startsWith('Search for "');
      logger.debug(`[${'checkTitleForBusqueda'.padEnd(HEAD_LEN, ' ')}]  -->  isOneFilm: ${!isSearch}`);

      return isSearch;
   } catch (error) {
      const msg = 'Error al verificar el título de la página';

      logger.error(`[${'checkTitleForBusqueda'.padEnd(HEAD_LEN, ' ')}]  -->  ${msg}`);
      throw new Error(`${msg}`);
   }
}

/**
 * Carga una página web y devuelve un objeto Cheerio que representa el contenido de la página.
 *
 * @param {string} url              - La URL de la página web a cargar.
 * @returns {Promise<CheerioAPI>}   - Un objeto Cheerio que representa el contenido de la página web cargada.
 * @throws {CustomError}            - Lanza un error personalizado si ocurre un error durante la carga de la página o la solicitud.
 */
async function cargarPagina(url: string): Promise<CheerioAPI> {
   logger.info(`[${'cargarPagina'.padEnd(HEAD_LEN, ' ')}]  -->  url: ${url}`);

   try {
      const body = await request({
         method: 'GET',
         uri: url,
      });

      return cheerio.load(body);
   } catch (error) {
      const msg = (error as any).message || 'Error al realizar la solicitud';
      logger.error(`[${'cargarPagina'.padEnd(HEAD_LEN, ' ')}]  -->  ${msg}`);

      const customError: CustomError = {
         statusCode: (error as any).statusCode || 500,
         message: msg,
         body: (error as any).response ? (error as any).response.body : undefined,
      };

      throw customError;
   }
}

/**
 * Obtiene texto de un objeto Cheerio considerando el idioma y el valor de contexto proporcionados.
 *
 * @param {CheerioAPI} cheerio      - Un objeto Cheerio que representa el contenido de la página web.
 * @param {string} lang             - El idioma en el que se debe buscar el texto (solo permitido, 'es' o 'en').
 * @param {string} esValue          - El valor del contexto en español.
 * @param {string} enValue          - El valor del contexto en inglés.
 * @returns {string}                - El texto obtenido del objeto Cheerio, con saltos de línea eliminados y espacios extra recortados.
 */
function getTextFromCheerioAPI(cheerio: CheerioAPI, lang: string, esValue: string, enValue: string): string {
   const contextoActual = lang === 'es' ? esValue : enValue;
   const parse = `dt:contains("${contextoActual}")`;

   logger.debug(`[${'getTextFromCheerioAPI'.padEnd(HEAD_LEN, ' ')}]  -->  ${parse}`);
   return cheerio(`${parse}`).next().text().replace(/\n/g, ' ').trim();
}
