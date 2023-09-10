const PORT = 3000;

const express   = require('express');
const cors      = require('cors');
const app       = express()

app.use(cors())

const { getSearch, getInfoFilm } = require('./utils/webScraper.js');
const { sendReadmeAsHtml } = require('./utils/description.js');
const { getCurrentFormattedDate } = require('./utils/utils.js');


/**
 * Inicializa el servidor y escucha en el puerto especificado.
 *
 * @param {number} PORT     - Puerto en el que se iniciará el servidor.
 */
app.listen(PORT, () => {
    console.log(`\n[${getCurrentFormattedDate()}] --> Server is up and running at port ${PORT}`);
})


/**
 * Maneja las solicitudes GET en la ruta raíz y envía un mensaje de confirmación.
 *
 * @param {object} req      - Objeto de solicitud HTTP.
 * @param {object} res      - Objeto de respuesta HTTP.
 */
app.get('/', (req, res) => {
    console.log(`[${getCurrentFormattedDate()}] --> GET: ${req.hostname}${req.url}`);
	res.send('✅ Unofficial Filmaffinity REST API server is online')
})


/**
 * Maneja las solicitudes GET en la ruta '/api' y envía el contenido HTML del archivo README como respuesta.
 *
 * @param {object} req      - Objeto de solicitud HTTP.
 * @param {object} res      - Objeto de respuesta HTTP.
 */
app.get('/api', (req, res) => {
    console.log(`[${getCurrentFormattedDate()}] --> GET: ${req.hostname}${req.url}`);
    res.send(sendReadmeAsHtml());
})


/**
 * Maneja las solicitudes GET para buscar películas en Filmaffinity por título.
 *
 * @param {object} req      - Objeto de solicitud HTTP.
 * @param {object} res      - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Promesa que resuelve cuando se envía la lista de películas coincidentes.
 */
app.get('/api/search', async (req, res) => {
    const url = `https://www.filmaffinity.com/es/search.php?stype=title&stext=${req.query.str}`;
    console.log(`[${getCurrentFormattedDate()}] --> GET: ${req.hostname}${req.url}  <-->  URL: ${url}`);
    res.send(await getSearch(url));
})


/**
 * Maneja las solicitudes GET para obtener información de una película en Filmaffinity por su ID.
 *
 * @param {object} req      - Objeto de solicitud HTTP.
 * @param {object} res      - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Promesa que resuelve cuando se envía la información de la película.
 */
app.get('/api/film', async (req, res) => {
    const url = `https://www.filmaffinity.com/es/film${req.query.id}.html`;
    console.log(`[${getCurrentFormattedDate()}] --> GET: ${req.hostname}${req.url}  <-->  URL: ${url}`);
    res.send(await getInfoFilm(url));
})




