

document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('userEmail');
    // Guardar cambios en localStorage
    function guardarUsuarios() {
        localStorage.setItem("usuariosHuertoHogar", JSON.stringify(usuarios));
        
    }

    let usuarios = JSON.parse(localStorage.getItem("usuariosHuertoHogar")) || [];

    if (typeof usuariosArray !== "undefined" && usuariosArray.length > 0) {
        usuarios.forEach(usuario => {
            console.log("Verificando usuario:", usuario);

            const index = usuariosArray.findIndex(usuarioArray => usuarioArray.email === usuario.email);
            
            if (index === -1) {
                usuariosArray.push(usuario);
            } else {
                usuariosArray.splice(index, 1, usuario);
            }
        });
    }
    if (typeof usuariosArray !== "undefined") {
        usuariosArray.forEach(usuarioArray => {
            const existe = usuarios.some(usuario => usuario.email === usuarioArray.email);
            if (!existe) {
                usuarios.push(usuarioArray);
            }
        });
    }
    guardarUsuarios();

    

    // --- Renderizar tabla ---
    function renderizarUsuarios() {
        console.log("Renderizando usuarios:", usuarios);
        const tbody = document.querySelector("#tablaUsuarios tbody");
        tbody.innerHTML = "";

        usuarios.forEach((usuario, index) => {
    if (usuario.email === userEmail) return; // No mostrar al admin logueado
        const fila = `
            <tr>
                <td>${usuario.email}</td>
                <td>${usuario.nombre}</td>
                <td>
                    <span class="badge ${usuario.rol === 'admin' ? 'bg-danger' : usuario.rol === 'vendedor' ? 'bg-warning text-dark' : 'bg-info'}">
                        ${usuario.rol}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-warning btn-action me-2" onclick="abrirEditar(${index})" title="Editar usuario">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-action" onclick="abrirEliminar(${index})" title="Eliminar usuario">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", fila);
});
    }

// --- Abrir modal Editar ---
window.abrirEditar = function(index) {
    const usuario = usuarios[index];
    
    // Llenar los campos básicos
    document.getElementById("editarEmail").value = usuario.email;
    document.getElementById("editarNombre").value = usuario.nombre || "";
    document.getElementById("editarRol").value = usuario.rol;
    document.getElementById("editarDireccion").value = usuario.direccion || "";
    document.getElementById("editarTelefono").value = usuario.telefono || "";
    
    const regionSelect = document.getElementById("editarRegion");
    const comunaSelect = document.getElementById("editarComuna");
    
    // Limpiar selects antes de llenarlos
    regionSelect.innerHTML = '<option value="">Seleccione una región</option>';
    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
    
    // Llenar el select de regiones
    Object.keys(regionesComunas).forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });
    
    // Establecer la región del usuario y luego cargar sus comunas
    if (usuario.region) {
        regionSelect.value = usuario.region;
        
        // Cargar las comunas correspondientes a la región
        const comunas = regionesComunas[usuario.region] || [];
        comunas.forEach(comuna => {
            const option = document.createElement("option");
            option.value = comuna;
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
        
        // Establecer la comuna del usuario después de cargar las opciones
        setTimeout(() => {
            if (usuario.comuna) {
                comunaSelect.value = usuario.comuna;
            }
        }, 0);
    }
    
    // Event listener para cuando cambie la región
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
    
    // Guardamos el índice temporal
    document.getElementById("formEditarUsuario").dataset.index = index;
    
    const modal = new bootstrap.Modal(document.getElementById("modalEditar"));
    modal.show();
}

    // --- Guardar cambios en Editar ---
    document.getElementById("formEditarUsuario").addEventListener("submit", function (e) {
        e.preventDefault();

        const index = this.dataset.index;
        usuarios[index].email = document.getElementById("editarEmail").value;
        usuarios[index].nombre = document.getElementById("editarNombre").value;
        usuarios[index].rol = document.getElementById("editarRol").value;
        usuarios[index].direccion = document.getElementById("editarDireccion").value;
        usuarios[index].comuna = document.getElementById("editarComuna").value;
        usuarios[index].region = document.getElementById("editarRegion").value;
        usuarios[index].telefono = document.getElementById("editarTelefono").value;

        guardarUsuarios();
        renderizarUsuarios();

        bootstrap.Modal.getInstance(document.getElementById("modalEditar")).hide();
    });

    // --- Abrir modal Eliminar ---
    window.abrirEliminar = function(index) {
        const usuario = usuarios[index];
        document.getElementById("usuarioAEliminar").textContent = usuario.email;

        document.getElementById("confirmarEliminar").onclick = function () {
            usuarios.splice(index, 1);
            guardarUsuarios();
            renderizarUsuarios();

            bootstrap.Modal.getInstance(document.getElementById("modalEliminar")).hide();
        };

        const modal = new bootstrap.Modal(document.getElementById("modalEliminar"));
        modal.show();
    }

// Función para inicializar el modal de registro
function inicializarModalRegistro() {
    const regionSelect = document.getElementById("nuevaRegion");
    const comunaSelect = document.getElementById("nuevaComuna");
    
    // Limpiar selects
    regionSelect.innerHTML = '<option value="">Seleccionar región...</option>';
    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
    
    // Llenar el select de regiones
    Object.keys(regionesComunas).forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });
    
    // Event listener para cambios de región
    regionSelect.addEventListener("change", () => {
        comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
        
        if (regionSelect.value) {
            const comunas = regionesComunas[regionSelect.value] || [];
            comunas.forEach(comuna => {
                const option = document.createElement("option");
                option.value = comuna;
                option.textContent = comuna;
                comunaSelect.appendChild(option);
            });
        }
    });
}

// --- Registrar nuevo usuario ---
document.getElementById("formRegistrarUsuario").addEventListener("submit", function (e) {
    e.preventDefault();

    const campos = {
        email: document.getElementById("nuevoEmail").value.trim(),
        confirmEmail: document.getElementById("nuevoConfirmEmail").value.trim(), 
        password: document.getElementById("nuevoPassword").value.trim(),
        confirmPassword: document.getElementById("nuevoConfirmPassword").value.trim(), 
        telefono: document.getElementById("nuevoTelefono").value.trim(),
        regionSelect: document.getElementById("nuevaRegion"),
        comunaSelect: document.getElementById("nuevaComuna"),
        checkboxElement: document.getElementById("nuevoTerminos")
    };

    // Validar todos los campos
    const validacion = validarFormularioUsuario(campos);
    
    if (!validacion.isValid) {
        // Mostrar el primer error
        mostrarAlertaValidacion(validacion.errors[0], 'danger');
        return;
    }

    // Verificar si el email ya existe
    if (usuarios.some(user => user.email === campos.email)) {
        mostrarAlertaValidacion('Este correo ya está registrado', 'danger');
        return;
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
        email: campos.email,
        nombre: campos.nombre,
        password: campos.password,
        rol: document.getElementById("nuevoRol").value,
        telefono: campos.telefono,
        direccion: document.getElementById("nuevaDireccion").value.trim(),
        region: campos.regionSelect.value,
        comuna: campos.comunaSelect.value,
        fechaRegistro: new Date().toISOString()
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios();
    renderizarUsuarios();

    // Cerrar modal y limpiar formulario
    this.reset();
    bootstrap.Modal.getInstance(document.getElementById("modalRegistrar")).hide();
    
    // Mostrar mensaje de éxito
    mostrarAlertaValidacion('¡Usuario registrado exitosamente!', 'success');
});

// Inicializar el modal cuando se muestre
document.getElementById('modalRegistrar').addEventListener('show.bs.modal', function () {
    inicializarModalRegistro();
});

// Limpiar el modal cuando se cierre
document.getElementById('modalRegistrar').addEventListener('hidden.bs.modal', function () {
    document.getElementById("formRegistrarUsuario").reset();
});

    // --- Inicializar ---
    renderizarUsuarios();
});