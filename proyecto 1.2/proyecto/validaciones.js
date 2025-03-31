$(document).ready(function () {
    $('#registroForm').submit(function (event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        var correo = $('#correo').val();
        var correoVerificado = $('#correoVerificado').val();
        var contraseña = $('#contraseña').val();
        var verificarContraseña = $('#verificarContraseña').val();

        var regexContraseña = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!correo || !correoVerificado || !contraseña || !verificarContraseña) {
            swal("Error", "Todos los campos son obligatorios", "error");
            return;
        }

        if (correo.length > 30) {
            swal("Error", "El correo es demasiado largo", "error");
            return;
        }

        if (correo !== correoVerificado) {
            swal("Error", "Los correos no coinciden", "error");
            return;
        }

        if (contraseña !== verificarContraseña) {
            swal("Error", "Las contraseñas no coinciden", "error");
            return;
        }

        if (!regexContraseña.test(contraseña)) {
            swal("Error", "La contraseña debe tener al menos 1 mayúscula, 1 minúscula, 1 número, 1 carácter especial y un mínimo de 8 caracteres.", "error");
            return;
        }

        // Si todas las validaciones pasan, enviamos el formulario
        $.ajax({
            url: 'http://localhost:5000/api/registro',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                correo: correo,
                correoVerificado: correoVerificado,
                contraseña: contraseña,
                verificarContraseña: verificarContraseña
            }),
            success: function (response) {
                swal("Éxito", response.mensaje, "success").then(() => {
                    window.location.href = 'inicio_secion.html';
                });
            },
            error: function (xhr) {
                var mensajeError = xhr.responseJSON?.error || "Error en el registro";
                swal("Error", mensajeError, "error");
            }
        });
    });
});
