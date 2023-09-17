import logger from '../logger';
import request from 'request-promise';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';

import { CustomError, handleError, createError } from '../types/CustomError';
import { SearchResponse } from '../types/Response/SearchResponse';
import { FilmResponse } from '../types/Response/FilmResponse';

import { FilmRequest } from '../types/Request/FilmRequest';
import { SearchRequest } from '../types/Request/SearchRequest';

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

   try {
      const $ = await getPageHTML(url);

      const titulo = $('h1#main-title span[itemprop="name"]').text().trim();

      const reparto = $('li[itemprop="actor"]')
         .map(function () {
            const title = $(this).find('a[itemprop="url"]').attr('title');
            return title ? title.trim() : ''; // Comprobación de nulidad y valor predeterminado
         })
         .get()
         .join(' | ');

      const generos = arrayToTextFromCheerioAPI($, inSpanish, 'Género', 'Genre', 'span[itemprop="genre"] a');

      const companias = arrayToTextFromCheerioAPI($, inSpanish, 'Compañías', 'Producer', 'a');

      const nota = $('#movie-rat-avg').attr('content');
      const votos = $('#movie-count-rat span[itemprop="ratingCount"]').attr('content');
      const img = $('img[itemprop="image"]').attr('src');

      const result: FilmResponse = {
         titulo: titulo,
         titulo_original: getTextFromCheerioAPI($, inSpanish, 'Título original', 'Original title').replace(/aka$/, ''),
         anyo: parseInt(getTextFromCheerioAPI($, inSpanish, 'Año', 'Year'), 10),
         duracion: getTextFromCheerioAPI($, inSpanish, 'Duración', 'Running time'),
         pais: getTextFromCheerioAPI($, inSpanish, 'País', 'Country'),
         direccion: getTextFromCheerioAPI($, inSpanish, 'Dirección', 'Director'),
         guion: getTextFromCheerioAPI($, inSpanish, 'Guion', 'Screenwriter').replace('.  Novela', ' | Novela'),
         reparto: reparto,
         musica: getTextFromCheerioAPI($, inSpanish, 'Música', 'Music'),
         fotografia: getTextFromCheerioAPI($, inSpanish, 'Fotografía', 'Cinematography'),
         companias: companias,
         genero: generos,
         sinopsis: getTextFromCheerioAPI($, inSpanish, 'Sinopsis', 'Synopsis').replace(/ \(FILMAFFINITY\)/g, ''),
         nota: nota !== undefined ? parseFloat(nota) : 0,
         votos: votos !== undefined ? parseInt(votos, 10) : 0,
         img: img ?? '',
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
      const $ = await getPageHTML(url);

      const result: SearchResponse[] = [];
      if (checkTitleForBusqueda($)) {
         logger.debug(`getSearchedFilms  -->  Extrayendo datos de la búsqueda: ${url}`);

         $('.se-it.mt').each(function () {
            const anyo_encontrado = parseInt($(this).find('.ye-w').text(), 10);
            const anyo_buscado = search.year ?? 0;

            // anyo_buscado > 0 significa que queremos encontrar la película de ese año
            // por tanto, en ese caso, no queremos las que anyo_encontrado !== anyo_encontrado
            if (anyo_buscado > 0 && anyo_buscado != anyo_encontrado) {
               return;
            }
            const enlace = $(this).find('.mc-title a').attr('href');

            // Si enlace NO hay un enlace válido, no se ha ejecutado correctamente la búsqueda
            if (enlace === undefined) {
               return;
            }
            const id = enlace.match(/film(\d+)\.html/)![1];

            result.push({
               id: parseInt(id, 10),
               titulo: $(this).find('.mc-title a').text().trim(),
               anyo: anyo_encontrado,
               link: enlace,
            });
         });
      } else {
         logger.debug(`getSearchedFilms  -->  Extrayendo datos de la película: ${url}`);

         const enlace = $('meta[property="og:url"]').attr('content') || '';
         const matchResult = enlace.match(/film(\d+)\.html/);

         if (matchResult === null) {
            return createError(logger, 'getSearchedFilms', 'Sin coincidencias con estos parámetros', 404, url);
         }

         result.push({
            id: parseInt(matchResult[1], 10),
            titulo: $('h1#main-title span[itemprop="name"]').text().trim(),
            anyo: parseInt(getTextFromCheerioAPI($, search.lang == 'es', 'Año', 'Year'), 10),
            link: enlace,
         });
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
