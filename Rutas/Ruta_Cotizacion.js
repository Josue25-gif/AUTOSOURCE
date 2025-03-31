const express = require('express');
const router = express.Router();
const Cotizacion = require('../models/Cotizacion'); // Asegúrate de que el path sea correcto

// Ruta para guardar la cotización
router.post('/cotizar', async (req, res) => {
    try {
        const { nombre, email, telefono, financiamiento, vehiculo } = req.body;

        if (!nombre || !email || !telefono || !financiamiento || !vehiculo) {
            return res.status(400).json({ error: 'Todos los campos son requeridos.' });
        }

        // Crear una nueva cotización
        const nuevaCotizacion = new Cotizacion({
            nombre,
            email,
            telefono,
            financiamiento,
            vehiculo,
        });

        // Guardar en la base de datos
        await nuevaCotizacion.save();
        res.status(201).json({ mensaje: 'Cotización guardada exitosamente' });
    } catch (error) {
        console.error('Error al guardar la cotización:', error);
        res.status(500).json({ error: 'Error al guardar la cotización' });
    }
});

module.exports = router;