const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Necesario para generar el token de recuperación

// Esquema del usuario
const usuariosSchema = new mongoose.Schema({
  correo: { type: String, required: true, unique: true },
  correoVerificado: { type: Boolean, default: false },
  contraseña: { type: String, required: true },
  resetPasswordToken: { type: String }, // Token de recuperación
  resetPasswordExpires: { type: Date } // Expiración del token de recuperación
});

// Método para encriptar la contraseña antes de guardarla
usuariosSchema.pre('save', async function(next) {
  if (this.isModified('contraseña')) {
    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
  }
  next();
});

// Comprobar si la contraseña ingresada coincide con la guardada
usuariosSchema.methods.compararContraseña = async function(contraseña) {
  return bcrypt.compare(contraseña, this.contraseña);
};

// Método para generar un JWT
usuariosSchema.methods.generarToken = function() {
  const payload = {
    usuarioId: this._id,
    correo: this.correo
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

// Método para generar el token de recuperación de contraseña
usuariosSchema.methods.generarResetToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');  // Generar un token aleatorio
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hora de expiración
  return resetToken;
};

// Método para verificar si el token de recuperación ha expirado
usuariosSchema.methods.esTokenValido = function() {
  return this.resetPasswordExpires > Date.now(); // Verifica si el token sigue siendo válido
};

// Método para limpiar los datos del token de recuperación
usuariosSchema.methods.limpiarTokenDeRecuperación = function() {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
};

const Usuarios = mongoose.model('Usuarios', usuariosSchema);

module.exports = Usuarios;
