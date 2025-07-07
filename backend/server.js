// Importar módulos necesarios
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise'); // Usamos la versión con promesas de mysql2

// Cargar variables de entorno desde .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto de las variables de entorno o 3000 por defecto

// --- Configuración de la Conexión a la Base de Datos ---
let dbConnection;

async function connectDB() {
    try {
        dbConnection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || 'root',
            database: process.env.MYSQL_DATABASE || 'clinica-db',
            port: process.env.MYSQL_PORT || 3306 // Puerto MySQL
        });
        console.log('Conexión a la base de datos MySQL establecida correctamente.');
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        // Opcional: Salir del proceso si la DB es crítica para iniciar
        // process.exit(1);
    }
}

// Conectar a la DB al iniciar el servidor
connectDB();

// --- Middleware ---
// Middleware para parsear JSON en las peticiones (para API REST)
app.use(express.json());
// Middleware para parsear datos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }));

// --- Servir archivos estáticos del frontend (tu carpeta public) ---
// Esto hace que todo lo que esté en 'public' sea accesible directamente.
// Por ejemplo, 'index.html' estará en '/'
app.use(express.static(path.join(__dirname, '../public')));

// --- Rutas de tu API (ejemplo) ---
// Aquí es donde conectarías tus archivos de rutas (patientsController, studiesController)
// Por ahora, un ejemplo simple:
app.get('/api/test', async (req, res) => {
    try {
        // Ejemplo de consulta a la base de datos
        const [rows, fields] = await dbConnection.execute('SELECT 1 + 1 AS solution');
        res.json({ message: 'API de prueba funcionando', solution: rows[0].solution });
    } catch (error) {
        console.error('Error en /api/test:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

// Ruta principal para servir tu archivo HTML
// Esto asegura que si alguien va a la raíz, reciba tu index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/index.html'));
});

// --- Iniciar el Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor Node.js escuchando en el puerto ${PORT}`);
    console.log(`Accede a la aplicación en http://localhost:${PORT}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Application specific logging, throwing an error, or other logic here
    process.exit(1); // Considerar salir del proceso en caso de excepción no capturada
});