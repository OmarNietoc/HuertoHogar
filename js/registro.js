// registro.js
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

        const campos = {
            nombre: document.getElementById("fullName").value.trim(),
            email: document.getElementById("email").value.trim(),
            confirmEmail: document.getElementById("confirmEmail").value.trim(),
            password: passwordInput.value.trim(),
            confirmPassword: confirmPasswordInput.value.trim(),
            telefono: document.getElementById("phone").value.trim(),
            regionSelect,
            comunaSelect,
            checkboxElement: document.getElementById("rememberMe")
        };

        const resultado = validarFormularioUsuario(campos);

        if (!resultado.isValid) {
            resultado.errors.forEach(error => mostrarAlertaValidacion(error, "danger"));
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem("usuariosHuertoHogar")) || [];

        if (usuarios.some(user => user.email === campos.email)) {
            mostrarAlertaValidacion("Este correo ya está registrado", "danger");
            return;
        }

        usuarios.push({
            fullName: campos.nombre,
            email: campos.email,
            password: campos.password,
            rol: "cliente",
            phone: campos.telefono,
            region: campos.regionSelect.value,
            comuna: campos.comunaSelect.value
        });
        localStorage.setItem("usuariosHuertoHogar", JSON.stringify(usuarios));

        mostrarAlertaValidacion("¡Usuario registrado exitosamente!", "success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    });
});
