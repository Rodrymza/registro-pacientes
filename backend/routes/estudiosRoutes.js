const express = require('express');
const router = express.Router();
// GET /api/estudios
router.get('/', async (req, res) => {
    // Accede a la conexión directamente desde req.dbConnection
    const dbConnection = req.dbConnection 

    if (!dbConnection) {
        return res.status(500).json({ error: 'Conexión a la base de datos no establecida.' });
    }
    try {
        const [rows] = await dbConnection.query('SELECT id_estudio, nombre_estudio, nombre_tipo_estudio FROM estudio_con_tipo');
        res.json(rows); // Envía los estudios como respuesta JSON
    } catch (err) {
        console.error('Error al obtener estudios:', err);
        res.status(500).json({ error: 'Error interno del servidor al obtener estudios.' });
    }
});

// Ruta para obtener estudios por tipo
router.get('/:id', async (req, res) => {
    const dbConnection = req.dbConnection 
    if (!dbConnection) {
        return res.status(500).json({ error: 'Conexión a la base de datos no establecida.' });
    }
    const idTipoEstudio = req.params.id;
    try {
        const [rows] = await dbConnection.query('SELECT id_estudio, nombre_estudio FROM estudio_con_tipo WHERE id_tipo_estudio = ?', [idTipoEstudio]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Estudio no encontrado.' });
        }
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener estudio por ID:', err);
        res.status(500).json({ error: 'Error interno del servidor al obtener estudio.' });
    }
});

module.exports = router;