// Importar módulos necesarios
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise'); // Usamos la versión con promesas de mysql2

// Importa los módulos de rutas
const estudioRoutes = require('./routes/estudiosRoutes');
const tipoEstudioRoutes = require('./routes/tipoEstudioRoutes');


// Cargar variables de entorno desde .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
//console.log('Variables de entorno cargadas:', process.env);

const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto de las variables de entorno o 3000 por defecto

// --- Configuración de la Conexión a la Base de Datos ---
let dbConnection;

async function connectDBWithRetry(retries = 5, delay = 5000) {
    try {
        dbConnection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || 'root',
            database: process.env.MYSQL_DATABASE || 'clinica-db',
            port: parseInt(process.env.MYSQL_PORT) || 3306,
            charset: 'utf8mb4'
        });
        console.log('Conexión a la base de datos MySQL establecida correctamente.');

    } catch (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        if (retries > 0) {
            console.log(`Reintentando conexión a la DB en ${delay / 1000} segundos... (${retries} intentos restantes)`);
            setTimeout(() => connectDBWithRetry(retries - 1, delay), delay);
        } else {
            console.error('No se pudo establecer conexión a la base de datos después de varios reintentos. Saliendo...');
            process.exit(1); // Salir si no se puede conectar a la DB
        }
    }
}

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Servir archivos estáticos del frontend ---
app.use(express.static(path.join(__dirname, '../public')));

// --- Nuevo Middleware para la Conexión DB ---
app.use((req, res, next) => {
    if (!dbConnection) {
        // Si por alguna razón la conexión no está establecida, devuelve un error 503 (Servicio no disponible)
        return res.status(503).json({ error: 'La base de datos no está conectada o no está disponible.' });
    }
    // Adjunta la conexión al objeto de la solicitud
    req.dbConnection = dbConnection;
    next(); // Pasa al siguiente middleware o a la ruta
});

// Ruta principal para servir tu archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/index.html'));
});

// Montar las rutas de estudios
app.use('/api/estudios', estudioRoutes);
app.use('/api/tipo-estudio', tipoEstudioRoutes);

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

async function startServer() {
    await connectDBWithRetry(); // Espera a que la DB se conecte (con reintentos)
    app.listen(PORT, () => {
        console.log(`Servidor Node.js escuchando en el puerto ${PORT}`);
        console.log(`Accede a la aplicación en http://localhost:${PORT}`);
    });
}

startServer();