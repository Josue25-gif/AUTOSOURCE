const mongoose = require('mongoose');

const cotizacionSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true },
    financiamiento: { type: String, required: true },
    vehiculo: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

// Crear el modelo
const Cotizacion = mongoose.model('Cotizacion', cotizacionSchema);

module.exports = Cotizacion;
