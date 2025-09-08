function mostrarAlerta(mensaje, tipo = "success") {
  let contenedor = document.getElementById("alert-container");
  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.id = "alert-container";
    contenedor.style.position = "fixed";
    contenedor.style.top = "20px";
    contenedor.style.right = "20px";
    contenedor.style.zIndex = "1050";
    document.body.appendChild(contenedor);
  }

  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
  alerta.role = "alert";
  alerta.innerHTML = `
    ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
  `;

  contenedor.appendChild(alerta);

  setTimeout(() => {
    alerta.remove();
  }, 6000);
}

document.addEventListener("DOMContentLoaded", () => {
(function () {
  'use strict';
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = form.querySelector('#nombre').value.trim();
    const correo = form.querySelector('#correo').value.trim();
    const comentario = form.querySelector('#comentario').value.trim();

    // Validaciones personalizadas
    if (nombre === "" || nombre.length > 100) {
      mostrarAlerta("⚠️ El nombre es requerido y no puede superar los 100 caracteres.", "danger");
      return;
    }

    const correoRegex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (!correoRegex.test(correo)) {
      mostrarAlerta("⚠️ Correo inválido. Solo se permiten @duoc.cl, @profesor.duoc.cl y @gmail.com.", "danger");
      return;
    }

    if (comentario === "" || comentario.length > 500) {
      mostrarAlerta("⚠️ El comentario es requerido y no puede superar los 500 caracteres.", "danger");
      return;
    }

    mostrarAlerta("✅ Gracias por tu mensaje, te responderemos pronto.", "success");
    form.reset();
  });
})();
});