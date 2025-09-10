
function inicializarPagina() {
    console.log('Página HuertoHogar cargada correctamente');
    verificarEstadoLogin();
    inicializarCarrito();
}


function iniciarSesion(email) {
    localStorage.setItem('usuarioLogueado', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('horaLogin', new Date().toISOString());
}

function cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('horaLogin');
    localStorage.removeItem("carritoHuertoHogar");
    window.location.href = 'index.html';
}

function verificarEstadoLogin() {
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    const loginRegisterDiv = document.getElementById('LoginRegister');
    const userLoggedInDiv = document.getElementById('userLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    const isAdmin = localStorage.getItem('isAdmin');
    const panelAdmin = document.getElementById('panelAdmin');



    if (usuarioLogueado === 'true') {
        // Mostrar bloque de usuario logueado
        userLoggedInDiv.classList.remove('d-none');
        userLoggedInDiv.classList.add('d-flex');

      if(isAdmin === 'true'){
        panelAdmin.classList.remove('d-none');
        panelAdmin.classList.add('d-flex');
      } else {
        panelAdmin.classList.add('d-none');
      }

        // Ocultar login/registro
        loginRegisterDiv.classList.add('d-none');

        // Mostrar email
        const welcomeText = userLoggedInDiv.querySelector('.user-email');
        if (welcomeText && userEmail) {
            welcomeText.textContent = userEmail;
        }
    } else {
        // Mostrar login/registro
        loginRegisterDiv.classList.remove('d-none');
        loginRegisterDiv.classList.add('d-flex');

        // Ocultar usuario logueado
        userLoggedInDiv.classList.add('d-none');
    }
}

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


document.addEventListener('DOMContentLoaded', () => {
    inicializarPagina();
    verificarEstadoLogin();
});