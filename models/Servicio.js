const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true },
    modeloAuto: { type: String, required: true },
    tipoServicio: { type: String, required: true },
    fecha: { type: Date, required: true }
});

module.exports = mongoose.model('Servicio', servicioSchema);