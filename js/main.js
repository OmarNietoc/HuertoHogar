
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
    window.location.href = 'index.html';
}

function verificarEstadoLogin() {
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    const loginRegisterDiv = document.getElementById('LoginRegister');
    const userLoggedInDiv = document.getElementById('userLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    
    if (usuarioLogueado === 'true') {
        // Mostrar bloque de usuario logueado
        userLoggedInDiv.classList.remove('d-none');
        userLoggedInDiv.classList.add('d-flex');

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

function mostrarAlerta(mensaje, tipo = 'primary') {
    const toastEl = document.getElementById('liveToast');
    const toastBody = toastEl.querySelector('.toast-body');
    toastBody.textContent = mensaje;

    toastEl.className = `toast align-items-center-${tipo} border-1 rounded`;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}


document.addEventListener('DOMContentLoaded', () => {
    inicializarPagina();
    verificarEstadoLogin();
});