
function inicializarPagina() {
    console.log('Página HuertoHogar cargada correctamente');
    verificarEstadoLogin();
    inicializarCarrito();
}

function inicializarLogin() {
    console.log('Página de login inicializada');
    
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', toggleVisibilidadPassword);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', manejarLogin);
    }
}

function toggleVisibilidadPassword() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}

function manejarLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!validarEmail(email)) {
        mostrarAlerta('Por favor, ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com)', 'error');
        return;
    }
    
    if (!validarPassword(password)) {
        mostrarAlerta('La contraseña debe tener entre 4 y 10 caracteres', 'error');
        return;
    }
    
    // Login exitoso
    iniciarSesion(email);
    mostrarAlerta('¡Inicio de sesión exitoso!', 'success');
    
    // Redirigir después de breve delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function validarEmail(email) {
    const emailRegex = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    return emailRegex.test(email);
}

function validarPassword(password) {
    return password.length >= 4 && password.length <= 10;
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
    
    if (usuarioLogueado === 'true' && loginRegisterDiv && userLoggedInDiv) {
        // Ocultar botones de login/registro y mostrar info de usuario
        loginRegisterDiv.classList.add('d-none');//oculta Login/Registro
        userLoggedInDiv.classList.remove('d-none');//muestra usuario logueado
        userLoggedInDiv.classList.add('d-flex');//muestra usuario logueado
        
        // Mostrar el email del usuario
        const welcomeText = userLoggedInDiv.querySelector('.user-email');
        if (welcomeText && userEmail) {
            welcomeText.textContent = userEmail;
        }
    }
}

// ===== FUNCIONES DE CARRITO =====
function inicializarCarrito() {
    // Cargar carrito desde localStorage
    const carrito = obtenerCarrito();
    actualizarContadorCarrito(carrito.length);
    
    // Configurar eventos del carrito
    const botonesCarrito = document.querySelectorAll('.btn-agregar-carrito');
    botonesCarrito.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
}

function obtenerCarrito() {
    const carritoJSON = localStorage.getItem('carritoHuertoHogar');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carritoHuertoHogar', JSON.stringify(carrito));
}

function agregarAlCarrito(e) {
    const boton = e.currentTarget;
    const card = boton.closest('.card');
    const productoId = card.dataset.productoId || generarIdProducto();
    const productoNombre = card.querySelector('.card-title').textContent;
    const productoPrecio = card.querySelector('.price').textContent;
    const productoImagen = card.querySelector('.card-img-top').src;
    
    const producto = {
        id: productoId,
        nombre: productoNombre,
        precio: productoPrecio,
        imagen: productoImagen,
        cantidad: 1
    };
    
    let carrito = obtenerCarrito();
    const productoExistente = carrito.find(item => item.id === productoId);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push(producto);
    }
    
    guardarCarrito(carrito);
    actualizarContadorCarrito(carrito.length);
    
    mostrarAlerta(`¡${productoNombre} agregado al carrito!`, 'success');
}

function actualizarContadorCarrito(cantidad) {
    const contadores = document.querySelectorAll('.cart-count');
    contadores.forEach(contador => {
        contador.textContent = cantidad;
        contador.style.display = cantidad > 0 ? 'flex' : 'none';
    });
}

function generarIdProducto() {
    return 'prod_' + Math.random().toString(36).substr(2, 9);
}


function mostrarAlerta(mensaje, tipo = 'primary') {
    const toastEl = document.getElementById('liveToast');
    const toastBody = toastEl.querySelector('.toast-body');
    toastBody.textContent = mensaje;

    toastEl.className = `toast align-items-center-${tipo} border-0`;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Verificar si estamos en página de login
if (document.getElementById('loginForm')) {
    document.addEventListener('DOMContentLoaded', inicializarLogin);
} else {
    document.addEventListener('DOMContentLoaded', inicializarPagina);
}