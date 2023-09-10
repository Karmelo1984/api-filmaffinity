# Usa una imagen base de Node.js
FROM node:10.24.1

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de tu aplicación al directorio de trabajo
COPY . .

# Instala las dependencias y luego ejecuta npm audit y npm audit fix
RUN npm install

# Expone el puerto en el que tu aplicación se ejecutará
EXPOSE 3000

# Comando para ejecutar tu aplicación
CMD ["node", "server.js"]

