
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

// function manejarLogin(e) {
//     e.preventDefault();

//     const email = document.getElementById("email").value.trim();
//     const password = document.getElementById("password").value.trim();

//     let usuarios = JSON.parse(localStorage.getItem("usuariosHuertoHogar")) || [];
//     const usuarioValido = usuarios.find(user => user.email === email && user.password === password);

//     if (!usuarioValido) {
//         mostrarAlerta("Correo o contraseña incorrectos", "danger");
//         return;
//     }

    

//     // Login exitoso
//     iniciarSesion(email);
//     mostrarAlerta("¡Inicio de sesión exitoso!", "success");

//     setTimeout(() => {
//         window.location.href = "index.html";
//     }, 1500);
// }

function manejarLogin(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Traemos usuarios desde localStorage o desde el array global usuariosArray.js
    let usuarios = JSON.parse(localStorage.getItem("usuariosHuertoHogar")) || [];
    if (typeof usuariosArray !== "undefined") {
        usuarios = [...usuarios, ...usuariosArray]; // combina los dos orígenes
    }
    console.log('Usuarios cargados:', usuarios);
    console.log("usuarios array:", usuariosArray);

    const usuarioValido = usuarios.find(user => user.email === email && user.password === password);

    if (!usuarioValido) {
        mostrarAlerta("❌ Correo o contraseña incorrectos", "danger");
        return;
    }

    // Guardar sesión en localStorage
    iniciarSesion(email);
    if (usuarioValido.rol === "admin") {
        localStorage.setItem("isAdmin", "true");
        mostrarAlerta("✅ Bienvenido Administrador", "success");

        setTimeout(() => {
            window.location.href = "home.html";
        }, 1200);
    } else {
        localStorage.setItem("isAdmin", "false");
        mostrarAlerta("👋 Inicio de sesión exitoso", "success");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    }
}



function validarEmail(email) {
    const emailRegex = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    return emailRegex.test(email);
}

function validarPassword(password) {
    return password.length >= 4 && password.length <= 10;
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

document.addEventListener('DOMContentLoaded', () => {
    inicializarLogin();
});