require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const mongoose = require('mongoose');
const usuarioRoutes = require('./Rutas/Ruta_Usuario'); // Ruta relativa a la carpeta "Rutas"
const rutaCotizacion = require('./Rutas/Ruta_Cotizacion'); 
const rutaServicio = require('./Rutas/Ruta_Servicio');
const rutaPrueba = require('./Rutas/Rutas_Prueba')
const vehiculoRoutes = require('./Rutas/Ruta_Vehiculos');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI; // Cargar URI desde variables de entorno

// 🔹 Verificar si la URI se está cargando correctamente
console.log("🔍 URI de MongoDB:", mongoURI);

// Middleware
app.use(cors());
app.use(express.json()); // Para poder manejar datos en formato JSON

// Middleware para encriptar la URL (esconde la estructura de las rutas)
app.use((req, res, next) => {
    const urlParts = req.originalUrl.split('/');
    
    // Aquí se procesa cualquier URL que esté destinada a HTMLs
    if (urlParts[1] === 'proyecto') {
        const fileName = urlParts[urlParts.length - 1]; // Obtener el nombre del archivo HTML
        const hash = crypto.createHash('sha256').update(fileName).digest('hex'); // Encriptar el nombre del archivo
        req.url = `/proyecto/${hash}.html`; // Redirigir a la URL encriptada
    }
    next();
});

// Ruta para servir los archivos estáticos (HTML, JS, CSS, etc.)
app.use('/proyecto', express.static(path.join(__dirname, 'proyecto 1.2', 'proyecto'))); // Ruta correcta para tus archivos

// Rutas de la API
app.use('/api', usuarioRoutes); 
app.use('/api', rutaCotizacion);
app.use('/api', rutaServicio);
app.use('/api', rutaPrueba);
app.use('/api', vehiculoRoutes);

// Conectar a MongoDB usando la URI cargada de .env
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Conectado a MongoDB Atlas"))
.catch(err => {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
});

// Escuchar en el puerto especificado
app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${port}`);
});
<<<<<<< HEAD



=======
>>>>>>> a9f4726 (primer commit)
