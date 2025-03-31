// models/Prueba.js
const mongoose = require('mongoose');

// Esquema para la prueba de manejo
const pruebaSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    telefono: String,
    modelo: String,
    fecha: Date
});

// Crear el modelo
const Prueba = mongoose.model('Prueba', pruebaSchema);

module.exports = Prueba;
