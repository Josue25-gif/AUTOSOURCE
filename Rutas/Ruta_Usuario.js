const express = require('express');
const Usuario = require('../models/Usuarios'); // Asegúrate de que la ruta esté correcta
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Para enviar correos electrónicos
const router = express.Router();

// Middleware para verificar el token de autenticación
function verificarToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token desde el encabezado
    
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Inicie sesión.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
}

// Ruta para registrar un nuevo usuario 
router.post('/registro', async (req, res) => {
    try {
        const { correo, correoVerificado, contraseña, verificarContraseña } = req.body;

        if (!correo || !correoVerificado || !contraseña || !verificarContraseña) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        if (correo !== correoVerificado) {
            return res.status(400).json({ error: 'Los correos no coinciden' });
        }

        if (contraseña !== verificarContraseña) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden' });
        }

        const regexContraseña = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!regexContraseña.test(contraseña)) {
            return res.status(400).json({
                error: 'La contraseña debe tener al menos 1 mayúscula, 1 minúscula, 1 número, 1 carácter especial y un mínimo de 8 caracteres.'
            });
        }

        const usuarioExistente = await Usuario.findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const contraseñaHash = await bcrypt.hash(contraseña, salt);

        const nuevoUsuario = new Usuario({
            correo,
            correoVerificado: false,
            contraseña: contraseñaHash,
        });

        await nuevoUsuario.save();

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });

    } catch (err) {
        console.error('Error al registrar el usuario:', err);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});
// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // Verificar si el usuario existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Comparar la contraseña ingresada con la almacenada en la base de datos
        const esValida = await usuario.compararContraseña(contraseña); // Usar el método del modelo
        if (!esValida) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Generar token de autenticación
        const token = usuario.generarToken(); // Usar el método del modelo

        res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token, usuario: { id: usuario._id, correo: usuario.correo } });
    } catch (err) {
        console.error('Error en el inicio de sesión:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para solicitar la recuperación de contraseña
router.post('/recuperar', async (req, res) => {
    const { correo } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({ error: 'Correo no registrado' });
        }

        // Generar el token de recuperación
        const resetToken = usuario.generarResetToken(); // Usar el método del modelo
        await usuario.save(); // Guardar el token en la base de datos

        // Enviar el correo con el enlace de recuperación
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            to: usuario.correo,
            from: process.env.EMAIL_USER,
            subject: 'Recuperación de contraseña',
            text: `Aquí está tu enlace para recuperar tu contraseña: 
                   http://localhost:5000/cambiar-contrasena/${resetToken}`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).json({ error: 'Error al enviar el correo' });
            }
            res.status(200).json({ mensaje: 'Correo de recuperación enviado' });
        });

    } catch (err) {
        console.error('Error al solicitar recuperación:', err);
        res.status(500).json({ error: 'Error interno al solicitar recuperación' });
    }
});

// Ruta para cambiar la contraseña
router.post('/cambiar-contrasena/:token', async (req, res) => {
    const { token } = req.params;
    const { nuevaContraseña, confirmarContraseña } = req.body;

    if (nuevaContraseña !== confirmarContraseña) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    try {
        const usuario = await Usuario.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!usuario) {
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }

        // Encriptar la nueva contraseña
        usuario.contraseña = nuevaContraseña; // La contraseña será encriptada en el modelo automáticamente
        usuario.limpiarTokenDeRecuperación(); // Limpiar el token y la fecha de expiración

        await usuario.save();
        res.status(200).json({ mensaje: 'Contraseña cambiada exitosamente' });
    } catch (err) {
        console.error('Error al cambiar la contraseña:', err);
        res.status(500).json({ error: 'Error al cambiar la contraseña' });
    }
});

module.exports = router;
