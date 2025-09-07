document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("RegisterForm");
    if (!registerForm) return; 

    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const regionSelect = document.getElementById("region");
    const comunaSelect = document.getElementById("comuna");

    const regionesComunas = {
        "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes"],
        "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"],
        "Biobío": ["Concepción", "Talcahuano", "Chillán"],
        "Antofagasta": ["Antofagasta", "Calama", "Mejillones"]
    };

    // Llenar regiones
    Object.keys(regionesComunas).forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });

    // Cambiar comunas según la región seleccionada
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

    // Toggle mostrar/ocultar contraseña
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

    // Validación y envío del formulario
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
            mostrarAlerta("El nombre completo debe tener al menos 3 caracteres", "error");
            return;
        }

        if (!validarEmail(email)) {
            mostrarAlerta("Correo inválido. Solo @duocuc.cl, @profesor.duoc.cl y @gmail.com", "error");
            return;
        }

        if (email !== confirmEmail) {
            mostrarAlerta("Los correos electrónicos no coinciden", "error");
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

        if (!region) {
            mostrarAlerta("Debes seleccionar una región", "error");
            return;
        }

        if (!comuna) {
            mostrarAlerta("Debes seleccionar una comuna", "error");
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

        usuarios.push({ fullName, email, password, phone, region, comuna });
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

    function mostrarAlerta(mensaje, tipo) {
        const toastEl = document.getElementById("liveToast");
        const toastBody = toastEl.querySelector(".toast-body");
        toastBody.textContent = mensaje;

        toastEl.classList.remove("text-bg-success", "text-bg-danger", "text-bg-primary");
        if (tipo === "success") toastEl.classList.add("text-bg-success");
        else if (tipo === "error") toastEl.classList.add("text-bg-danger");
        else toastEl.classList.add("text-bg-primary");

        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
});
