
##      BLOQUE BASE

FROM node:18.17.1-alpine3.18 AS base

# Variable para referenciar más eficientmente
ENV DIR /usr/src/app

# Establece el directorio de trabajo en el contenedor
WORKDIR $DIR


##      BLOQUE GENERACIÓN Y COMPILACIÓN

FROM base AS build

# Maximizar compatibilidad entre node y alpine
RUN apk update && \
    apk add --no-cache dumb-init

# Copia los archivos de tu aplicación al directorio de trabajo
# En el archivo '.dockerignore' hay filtro de que copiar y que no
COPY . $DIR

# Instalar solo las dependencias de producción
RUN yarn install

# Compila el proyecto
RUN yarn run build


##      BLOQUE EJECUCIÓN

FROM base AS production

# Copiamos solo los ficheros necesarios entre "imagenes"
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build $DIR/node_modules $DIR/node_modules
COPY --from=build $DIR/dist $DIR/dist


# Iniciamos una variable de entorno que indica que estamos en produccion
ENV NODE_ENV=production

# Expone el puerto en el que tu aplicación se ejecutará
EXPOSE 3000

# Comando para ejecutar tu aplicación
CMD ["dumb-init", "node", "dist/index.js"]
