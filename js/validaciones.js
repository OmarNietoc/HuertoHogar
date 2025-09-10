// validaciones.js - Funciones de validación reutilizables

/**
 * Validar formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
function validarEmail(email) {
    const emailRegex = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    return emailRegex.test(email);
}

/**
 * Validar longitud de nombre
 * @param {string} nombre - Nombre a validar
 * @param {number} min - Longitud mínima (default: 3)
 * @param {number} max - Longitud máxima (default: 100)
 * @returns {boolean} - True si es válido
 */
function validarNombre(nombre, min = 3, max = 100) {
    return nombre.length >= min && nombre.length <= max;
}

/**
 * Validar longitud de contraseña
 * @param {string} password - Contraseña a validar
 * @param {number} min - Longitud mínima (default: 4)
 * @param {number} max - Longitud máxima (default: 10)
 * @returns {boolean} - True si es válido
 */
function validarPassword(password, min = 4, max = 10) {
    return password.length >= min && password.length <= max;
}

/**
 * Validar que dos valores coincidan
 * @param {string} valor1 - Primer valor
 * @param {string} valor2 - Segundo valor
 * @returns {boolean} - True si coinciden
 */
function validarCoincidencia(valor1, valor2) {
    return valor1 === valor2;
}

/**
 * Validar que un select tenga una opción seleccionada
 * @param {HTMLSelectElement} selectElement - Elemento select
 * @returns {boolean} - True si tiene una selección válida
 */
function validarSelect(selectElement) {
    return selectElement.value !== '';
}

/**
 * Validar teléfono chileno
 * @param {string} telefono - Número de teléfono
 * @returns {boolean} - True si es válido
 */
function validarTelefono(telefono) {
    const telefonoRegex = /^(\+56|56)?[2-9]\d{8}$/;
    return telefono === '' || telefonoRegex.test(telefono.replace(/\s+/g, ''));
}

/**
 * Validar todos los campos de un formulario de usuario
 * @param {Object} campos - Objeto con los campos a validar
 * @returns {Object} - Objeto con { isValid: boolean, errors: array }
 */
function validarFormularioUsuario(campos) {
    const errors = [];
    
    // Validar nombre
    if (!validarNombre(campos.nombre || '')) {
        errors.push('El nombre debe tener entre 3 y 100 caracteres');
    }
    
    // Validar email
    if (!validarEmail(campos.email || '')) {
        errors.push('Correo inválido. Solo se permiten: @duoc.cl, @profesor.duoc.cl y @gmail.com');
    }
    
    // Validar contraseña (solo si se proporciona)
    if (campos.password && !validarPassword(campos.password)) {
        errors.push('La contraseña debe tener entre 4 y 10 caracteres');
    }
    
    // Validar coincidencia de emails (solo si se proporciona confirmEmail)
    if (campos.confirmEmail && !validarCoincidencia(campos.email, campos.confirmEmail)) {
        errors.push('Los correos electrónicos no coinciden');
    }
    
    // Validar coincidencia de passwords (solo si se proporciona confirmPassword)
    if (campos.confirmPassword && !validarCoincidencia(campos.password, campos.confirmPassword)) {
        errors.push('Las contraseñas no coinciden');
    }
    
    // Validar teléfono
    if (!validarTelefono(campos.telefono || '')) {
        errors.push('El teléfono debe ser un número chileno válido');
    }
    
    // Validar región
    if (campos.regionSelect && !validarSelect(campos.regionSelect)) {
        errors.push('Debes seleccionar una región');
    }
    
    // Validar comuna
    if (campos.comunaSelect && !validarSelect(campos.comunaSelect)) {
        errors.push('Debes seleccionar una comuna');
    }
    
    // Validar checkbox (solo si se proporciona)
    if (campos.checkboxElement && !campos.checkboxElement.checked) {
        errors.push('Debes aceptar los términos y condiciones');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Mostrar alerta de validación
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de alerta (success, danger, warning, info)
 */
function mostrarAlertaValidacion(mensaje, tipo = 'danger') {
    // Crear alerta bootstrap
    const alertaDiv = document.createElement('div');
    alertaDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertaDiv.style.position = 'fixed';
    alertaDiv.style.top = '20px';
    alertaDiv.style.right = '20px';
    alertaDiv.style.zIndex = '1050';
    alertaDiv.style.minWidth = '300px';
    alertaDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertaDiv);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        if (alertaDiv.parentNode) {
            alertaDiv.remove();
        }
    }, 3000);
}