const express = require('express');
const router = express.Router();

// GET /api/estudios
router.get('/', async (req, res) => {
        const dbConnection = req.dbConnection 

    if (!dbConnection) {
        return res.status(500).json({ error: 'Conexión a la base de datos no establecida.' });
    }
    try {
        const [rows] = await dbConnection.query('SELECT id_tipo_estudio, descripcion FROM tipo_estudio');
        res.json(rows); // Envía los estudios como respuesta JSON
    } catch (err) {
        console.error('Error al obtener estudios:', err);
        res.status(500).json({ error: 'Error interno del servidor al obtener estudios.' });
    }
});

module.exports = router;