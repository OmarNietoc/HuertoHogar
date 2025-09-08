

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("RegisterForm");
    if (!registerForm) return; 

    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const regionSelect = document.getElementById("region");
    const comunaSelect = document.getElementById("comuna");


    Object.keys(regionesComunas).forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });

    regionSelect.addEventListener("change", () => {
        comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
        const comunas = regionesComunas[regionSelect.value] || [];
        comunas.forEach(comuna => {
            const option = document.createElement("option");
            option.value = comuna;
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
    });

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
            icon.classList.replace("bi-eye", "bi-eye-slash");
        } else {
            input.type = "password";
            icon.classList.replace("bi-eye-slash", "bi-eye");
        }
    }

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const confirmEmail = document.getElementById("confirmEmail").value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const phone = document.getElementById("phone").value.trim();
        const region = regionSelect.value;
        const comuna = comunaSelect.value;
        const rememberMe = document.getElementById("rememberMe").checked;

        if (fullName.length < 3) {
            mostrarAlerta("El nombre completo debe tener al menos 3 caracteres", "danger");
            return;
        }

        if (!validarEmail(email)) {
            mostrarAlerta("Correo inválido. Solo @duoc.cl, @profesor.duoc.cl y @gmail.com", "danger");
            return;
        }

        if (email !== confirmEmail) {
            mostrarAlerta("Los correos electrónicos no coinciden", "danger");
            return;
        }

        if (password.length < 4 || password.length > 10) {
            mostrarAlerta("La contraseña debe tener entre 4 y 10 caracteres", "danger");
            return;
        }

        if (password !== confirmPassword) {
            mostrarAlerta("Las contraseñas no coinciden", "danger");
            return;
        }

        if (!region) {
            mostrarAlerta("Debes seleccionar una región", "danger");
            return;
        }

        if (!comuna) {
            mostrarAlerta("Debes seleccionar una comuna", "danger");
            return;
        }

        if (!rememberMe) {
            mostrarAlerta("Debes aceptar los términos y condiciones", "danger");
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem("usuariosHuertoHogar")) || [];
        
        if (usuarios.some(user => user.email === email)) {
            mostrarAlerta("Este correo ya está registrado", "danger");
            return;
        }

        usuarios.push({ fullName, email, password, phone, region, comuna });
        localStorage.setItem("usuariosHuertoHogar", JSON.stringify(usuarios));

        mostrarAlerta("¡Usuario registrado exitosamente!", "success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    });

    function validarEmail(email) {
        const emailRegex = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        return emailRegex.test(email);
    }

});
