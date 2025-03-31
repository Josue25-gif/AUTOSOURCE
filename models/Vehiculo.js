const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    name: String,
    brand: String,
    year: Number,
    price: Number,
    quantity: Number,
    imageUrl: String  // Almacena la URL de la imagen
});

module.exports = mongoose.model("Car", carSchema);
