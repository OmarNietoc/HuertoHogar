document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("RegisterForm");
    if (!registerForm) return; 

    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    togglePassword.addEventListener("click", () => {
        togglePasswordType(passwordInput, togglePassword);
    });

    toggleConfirmPassword.addEventListener("click", () => {
        togglePasswordType(confirmPasswordInput, toggleConfirmPassword);
    });

    function togglePasswordType(input, button) {
        const icon = button.querySelector("i");
        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove("bi-eye");
            icon.classList.add("bi-eye-slash");
        } else {
            input.type = "password";
            icon.classList.remove("bi-eye-slash");
            icon.classList.add("bi-eye");
        }
    }

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const rememberMe = document.getElementById("rememberMe").checked;

        if (!validarEmail(email)) {
            mostrarAlerta("Correo inválido. Solo @duoc.cl, @profesor.duoc.cl y @gmail.com", "error");
            return;
        }

        if (password.length < 4 || password.length > 10) {
            mostrarAlerta("La contraseña debe tener entre 4 y 10 caracteres", "error");
            return;
        }

        if (password !== confirmPassword) {
            mostrarAlerta("Las contraseñas no coinciden", "error");
            return;
        }

        if (!rememberMe) {
            mostrarAlerta("Debes aceptar los términos y condiciones", "error");
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem("usuariosHuertoHogar")) || [];
        
        if (usuarios.some(user => user.email === email)) {
            mostrarAlerta("Este correo ya está registrado", "error");
            return;
        }

        usuarios.push({ email, password });
        localStorage.setItem("usuariosHuertoHogar", JSON.stringify(usuarios));

        mostrarAlerta("¡Usuario registrado exitosamente!", "success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    });

    function validarEmail(email) {
        const emailRegex = /^[^\s@]+@(duocuc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        return emailRegex.test(email);
    }
});