const request = require('request-promise');
const cheerio = require('cheerio');


/**
 * Realiza una búsqueda en 'FilmAffinity' y devuelve un array con los elementos encontrados.
 *
 * @param {string} url      - La URL de la página de búsqueda.
 * @returns {Object[]}      - Un array de objetos que representan los resultados de la búsqueda.
 */
async function getSearch(url) {
    try {
        const $ = await cargarPagina(url);
        
        const result = [];
        if (checkTitleForBusqueda($)) {

            $('.se-it.mt').each(function () {
                const anyo = $(this).find('.ye-w').text();
                const titulo = $(this).find('.mc-title a').text().trim();
                const enlace = $(this).find('.mc-title a').attr('href');
                const id = enlace.match(/film(\d+)\.html/)[1];
    
                result.push({
                    id: parseInt(id, 10),
                    titulo: titulo,
                    anyo: parseInt(anyo, 10),
                    enlace: enlace,
                });
            });
    
        } 
        else {
            
            const titulo = $('h1#main-title span[itemprop="name"]').text().trim();
            const anyo = $('dt:contains("Año")').next().text().trim();
            const enlace = $('meta[property="og:url"]').attr('content');
            const matchResult = enlace.match(/film(\d+)\.html/);
            
            if (matchResult === null) {
                return {
                    numero: 404,
                    descripcion: "Film not found"
                };
            }

            const id = matchResult[1];

            result.push({
                id: parseInt(id, 10),
                titulo: titulo,
                anyo: parseInt(anyo, 10),
                enlace: enlace,
            });
    
        }

        return result;

    } catch (error) {
        return {
            numero: error.statusCode,
            descripcion: error.body
        };
    }
}


/**
 * Obtiene información detallada de 'Filmaffinity' sobre una película en concreto.
 *
 * @param {string} url      - La URL de la página de la película.
 * @returns {Object}        - Un objeto que contiene información sobre la película.
 */
async function getInfoFilm(url) {
    try {
        const $ = await cargarPagina(url);

        const titulo = $('h1#main-title span[itemprop="name"]').text().trim();
        
        const tituloOriginal = $('dt:contains("Título original")').next().text().trim();
        const anyo = $('dt:contains("Año")').next().text().trim();
        const pais = $('dt:contains("País")').next().text().trim().replace(/, /g, ' | ');
        const direccion = $('dt:contains("Dirección")').next().text().trim().replace(/, /g, ' | ');
        const guion = $('dt:contains("Guion")').next().text().trim().replace(/, /g, ' | ').replace('.  Novela', ' | Novela');
        const reparto = $('li[itemprop="actor"]').map(function () {
            return $(this).find('a[itemprop="url"]').attr('title').trim();
        }).get().join(' | ');
        const generos = $('dt:contains("Género")').next().find('span[itemprop="genre"] a').map(function () {
            return $(this).text().trim();
        }).get().join(' | '); // Unir los géneros en una cadena separada por '|'
        const duracion = $('dt:contains("Duración")').next().text().trim();
        const musica = $('dt:contains("Música")').next().find('a').text().trim().replace(/, /g, ' | ');
        const fotografia = $('dt:contains("Fotografía")').next().find('a').text().trim().replace(/, /g, ' | ');
        const companias = $('dt:contains("Compañías")').next().find('a').map(function () {
            return $(this).text().trim();
        }).get().join(' | ')
        const sinopsis = $('dt:contains("Sinopsis")').next().text().trim().replace(' (FILMAFFINITY)','');

        const nota = $('#movie-rat-avg').attr('content');
        const votos = $('#movie-count-rat span[itemprop="ratingCount"]').attr('content');

        const result = {
            titulo: titulo,
            titulo_original: tituloOriginal,
            anyo: parseInt(anyo, 10),
            duracion: duracion,
            pais: pais,
            direccion: direccion,
            guion: guion,
            reparto: reparto,
            musica: musica,
            fotografia: fotografia,
            companias: companias,
            genero: generos,
            sinopsis: sinopsis,
            nota: parseFloat(nota),
            votos: parseInt(votos, 10)
        };

        return result;
    } catch (error) {
        return {
            numero: error.statusCode,
            descripcion: error.body
        };
    }
}


/**
 * Carga una página web y devuelve un objeto Cheerio utilizando async/await.
 *
 * @param {string} url      - La URL de la página web que se va a cargar.
 * @returns {CheerioStatic} - Un objeto Cheerio que representa el contenido de la página web cargada.
 * @throws {Error}          - Lanza un error si ocurre un problema durante la carga de la página.
 */
async function cargarPagina(url) {
    
    try {
        const body = await request({
            method: 'GET',
            uri: url,
        });

        return cheerio.load(body);
    } catch (error) {
        const customError = {
            statusCode: error.statusCode || 500, // Código de estado HTTP (predeterminado 500)
            message: error.message || 'Error al realizar la solicitud', // Mensaje de error personalizado
            body: error.response ? error.response.body : undefined, // Cuerpo de la respuesta (si está disponible)
        };

        throw customError; 
    }
}


/**
 * Verifica si la página de 'Filmaffinity' a analizar es de tipo "búsqueda" o de tipo "información".
 *
 * @param {Object} $ - Un objeto Cheerio que representa la página web.
 * @returns {boolean} - `true` si el título comienza con "Búsqueda de ", `false` en caso contrario.
 * @throws {Error} - Lanza un error si ocurre un problema durante la verificación.
 */
function checkTitleForBusqueda($) {

    try {
        // Obtén el texto del elemento <title> en el encabezado
        const pageTitle = $('head title').text();

        // Verifica si el título comienza con "Búsqueda de"
        return pageTitle.startsWith('Búsqueda de "');
    } catch (error) {
        throw new Error("Error al verificar el título de la página");
    }
}


module.exports = { getSearch, getInfoFilm };
