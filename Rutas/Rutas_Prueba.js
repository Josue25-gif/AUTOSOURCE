// Rutas/Rutas_Prueba.js
const express = require('express');
const router = express.Router();
const Prueba = require('../models/Prueba');;

// Ruta para guardar la prueba de manejo
router.post('/agendar', (req, res) => {
    const { nombre, email, telefono, modelo, fecha } = req.body;

    const nuevaPrueba = new Prueba({
        nombre,
        email,
        telefono,
        modelo,
        fecha
    });

    nuevaPrueba.save()
        .then(() => res.status(201).send('Prueba agendada correctamente'))
        .catch(err => res.status(500).send('Error al guardar la prueba'));
});

module.exports = router;
