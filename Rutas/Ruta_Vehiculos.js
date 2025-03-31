const express = require('express');
const router = express.Router();
const Vehiculo = require('../models/Vehiculo'); // Modelo de Vehiculo
const jwt = require('jsonwebtoken'); // Para la validación de JWT (si usas JWT para sesiones)

// Middleware para verificar si el usuario está autenticado
const verificarSesion = (req, res, next) => {
    const token = req.header('Authorization'); // Obtener token desde la cabecera "Authorization"
    
    if (!token) {
        return res.status(401).json({ error: 'No se ha iniciado sesión.' });
    }

    try {
        // Verificar el token (suponiendo que usas JWT)
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token
        req.user = decoded; // Almacena la información del usuario en el request
        next(); // Continua con la ejecución del siguiente middleware o ruta
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido.' });
    }
};

// Ruta para obtener todos los vehículos
router.get('/vehiculos', async (req, res) => {
    try {
        const vehicles = await Vehiculo.find(); // Obtener todos los vehículos de la base de datos
        res.json(vehicles); // Enviar los vehículos como un JSON
    } catch (err) {
        console.error('Error al obtener vehículos:', err);
        res.status(500).json({ error: 'Error al obtener vehículos' });
    }
});

// Ruta para comprar un vehículo
router.post('/comprar/:id', verificarSesion, async (req, res) => {
    const vehiculoId = req.params.id;

    try {
        // Buscar el vehículo por ID
        const vehiculo = await Vehiculo.findById(vehiculoId);

        if (!vehiculo) {
            return res.status(404).json({ error: 'Vehículo no encontrado' });
        }

        // Verificar si hay cantidad disponible
        if (vehiculo.cantidad <= 0) {
            return res.status(400).json({ error: 'No hay vehículos disponibles para comprar.' });
        }

        // Reducir la cantidad del vehículo
        vehiculo.cantidad -= 1;

        // Guardar el vehículo actualizado en la base de datos
        await vehiculo.save();

        res.json({ mensaje: 'Vehículo comprado exitosamente', vehiculo });
    } catch (err) {
        console.error('Error al comprar vehículo:', err);
        res.status(500).json({ error: 'Error al procesar la compra' });
    }
});

module.exports = router;