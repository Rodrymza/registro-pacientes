# Usamos la imagen oficial de Node.js
FROM node:18

# Creamos el directorio de trabajo
WORKDIR /app

COPY backend/package*.json ./backend/
COPY .env ./ 

WORKDIR /app/backend
RUN npm ci


COPY . .

# Exponemos el puerto que usará la aplicación
EXPOSE 3000

# Comando para iniciar el servidor
# Asegúrate de que esta ruta sea correcta desde el WORKDIR actual (/app)
CMD ["node", "backend/server.js"]