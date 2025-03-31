const express = require('express');
const router = express.Router();
const Servicio = require('../models/Servicio');

// Ruta para recibir los datos del formulario y guardarlos en la base de datos
router.post('/agendar-servicio', async (req, res) => {
    try {
        const { nombre, email, telefono, modeloAuto, tipoServicio, fecha } = req.body;

        const nuevoServicio = new Servicio({
            nombre,
            email,
            telefono,
            modeloAuto,
            tipoServicio,
            fecha
        });

        await nuevoServicio.save();
        res.status(201).json({ mensaje: "Servicio agendado correctamente" });

    } catch (error) {
        console.error("Error al agendar servicio:", error);
        res.status(500).json({ error: "Error al agendar el servicio" });
    }
});

module.exports = router;