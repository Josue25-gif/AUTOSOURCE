// models/vehiculo.js
const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema({
    nombre: String,
    marca: String,
    año: Number,
    precio: Number,
    imagen: String,
    enlaceDetalles: String,
    cantidad: { type: Number, default: 0 }  // Campo para almacenar la cantidad de unidades disponibles
});

const Vehiculo = mongoose.model('Vehiculo', vehiculoSchema);

module.exports = Vehiculo;