const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Car = require("../models/Vehiculo");

// Obtener todos los autos
router.get("/autos", async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los autos", error });
    }
});

// 🚀 NUEVA RUTA: Obtener un auto por su ID
router.get("/autos/:id", async (req, res) => {
    try {
        const carId = req.params.id;

        // Validar si el ID es válido en MongoDB
        if (!mongoose.Types.ObjectId.isValid(carId)) {
            return res.status(400).json({ error: "ID no válido" });
        }

        const car = await Car.findById(carId);

        if (!car) {
            return res.status(404).json({ error: "Auto no encontrado" });
        }

        res.json(car);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el auto", error });
    }
});

module.exports = router;
