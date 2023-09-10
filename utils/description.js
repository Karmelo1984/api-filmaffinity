const markdownIt    = require('markdown-it')();
const fs            = require('fs');
const path          = require('path');

const readmePath    = path.join(__dirname, '../README.md');
const cssFilePath   = path.join(__dirname, '../styles/style_03.css');

/**
 * Lee el contenido del archivo README.md de manera síncrona, convierte el Markdown en HTML
 * y devuelve el contenido HTML resultante.
 *
 * @throws {Error}      Si se produce un error al leer el archivo o al renderizar el Markdown.
 * @returns {string}    El contenido HTML generado a partir del archivo README.md.
 */
function sendReadmeAsHtml() {
    try {
        // Lee el contenido del archivo readme.md de manera síncrona
        const data = fs.readFileSync(readmePath, 'utf8');

        // Convierte el Markdown en HTML
        const htmlContent = markdownIt.render(data);

        const styledHTML = `
                            <!DOCTYPE html>
                            <html lang="es">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>API Filmaffinity</title>
                                <style>
                                    ${readCSSFileSync(cssFilePath)}
                                </style>
                            </head>
                            <body>
                                ${htmlContent}
                            </body>
                            </html>
                            `;
        return styledHTML;
    } catch (err) {
        throw err;
    }
}

function readCSSFileSync(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data;
    } catch (err) {
        throw err;
    }
  }

module.exports = { sendReadmeAsHtml };