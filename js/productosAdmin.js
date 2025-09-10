document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos desde localStorage o array por defecto
    let productos = JSON.parse(localStorage.getItem("productosHuertoHogar")) || [];
    console.log("Productos cargados desde localStorage:", productos);
    
    // Si no hay productos en localStorage, usar el array por defecto
    if (productos.length === 0 && typeof productosArray !== "undefined" && productosArray.length > 0) {
        productos = [...productosArray];
        console.log("No se encontraron productos en localStorage. Usando array por defecto:", productos);
        guardarProductos();
    }
    // Si hay productos en localStorage Y existe el array por defecto, fusionar evitando duplicados
    else if (typeof productosArray !== "undefined" && productosArray.length > 0) {

        const productosMap = new Map();
        
        productos.forEach(producto => {
            productosMap.set(producto.id, producto);
        });
        
        productosArray.forEach(productoArray => {
            if (!productosMap.has(productoArray.id)) {
                productosMap.set(productoArray.id, productoArray);
            }
        });

        productos = Array.from(productosMap.values());
        guardarProductos();
    }

    function guardarProductos() {
        localStorage.setItem('productosHuertoHogar', JSON.stringify(productos));
    }

    function renderizarProductos() {
        const tbody = document.querySelector('#tablaProductos tbody');
        tbody.innerHTML = '';

        productos.forEach((producto, index) => {
            const fila = `
                <tr>
                    <td>
                        <img src="${producto.imagen || './images/placeholder-product.jpg'}" 
                            alt="${producto.nombre}" 
                            class="product-img"
                            onerror="this.src='./images/placeholder-product.jpg'">
                    </td>
                    <td>${producto.nombre}</td>
                    <td>
                        <span class="badge badge-categoria badge-${producto.categoria}">
                            ${producto.categoria}
                        </span>
                    </td>
                    <td>
                        <span class="price-badge">$${producto.precio.toLocaleString('es-CL')} CLP</span>
                    </td>
                    <td>${producto.id}</td>
                    <td>
                        <button class="btn btn-sm btn-warning btn-action me-2" onclick="abrirEditarProducto(${index})" title="Editar producto">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-action" onclick="abrirEliminarProducto(${index})" title="Eliminar producto">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
    }

    // Función para abrir modal de edición
    window.abrirEditarProducto = function(index) {
        const producto = productos[index];
        
        // Llenar el formulario de edición con los datos del producto
        document.getElementById('editarNombre').value = producto.nombre;
        document.getElementById('editarPrecio').value = producto.precio;
        document.getElementById('editarCategoria').value = producto.categoria;
        document.getElementById('editarID').value = producto.id;
        document.getElementById('editarDescripcion').value = producto.descripcion || '';
        document.getElementById('editarImagen').value = producto.imagen || '';
        document.getElementById('editarOferta').value = producto.oferta || '';
        
        // Guardar el índice del producto a editar
        document.getElementById('formEditarProducto').dataset.index = index;
        
        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('modalEditarProducto'));
        modal.show();
    };

    // Función para eliminar producto
    window.abrirEliminarProducto = function(index) {
        const producto = productos[index];
        
        // Mostrar confirmación
        document.getElementById('productoAEliminar').textContent = producto.nombre;
        
        document.getElementById('confirmarEliminarProducto').onclick = function() {
            productos.splice(index, 1);
            guardarProductos();
            renderizarProductos();
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalEliminarProducto'));
            modal.hide();
        };
        
        // Mostrar modal de eliminación
        const modal = new bootstrap.Modal(document.getElementById('modalEliminarProducto'));
        modal.show();
    };

    // Event listener para formulario de edición
    document.getElementById('formEditarProducto').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const index = this.dataset.index;
        const producto = productos[index];
        
        // Actualizar producto
        producto.nombre = document.getElementById('editarNombre').value;
        producto.precio = parseInt(document.getElementById('editarPrecio').value);
        producto.categoria = document.getElementById('editarCategoria').value;
        producto.id = document.getElementById('editarID').value;
        producto.descripcion = document.getElementById('editarDescripcion').value;
        producto.imagen = document.getElementById('editarImagen').value;
        producto.oferta = document.getElementById('editarOferta').value;
        
        guardarProductos();
        renderizarProductos();
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarProducto'));
        modal.hide();
        
        // Mostrar mensaje de éxito
        mostrarAlerta('Producto actualizado exitosamente', 'success');
    });

    // Event listener para formulario de nuevo producto
    document.getElementById('formRegistrarProducto').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nuevoProducto = {
            id: document.getElementById('nuevoID').value,
            nombre: document.getElementById('nuevoNombre').value,
            precio: parseInt(document.getElementById('nuevoPrecio').value),
            categoria: document.getElementById('nuevoCategoria').value,
            descripcion: document.getElementById('nuevoDescripcion').value,
            imagen: document.getElementById('nuevoImagen').value,
            oferta: document.getElementById('nuevoOferta').value
        };
        
        // Verificar si ya existe un producto con ese ID
        if (productos.some(p => p.id === nuevoProducto.id)) {
            mostrarAlerta('Ya existe un producto con ese ID', 'danger');
            return;
        }
        
        productos.push(nuevoProducto);
        guardarProductos();
        renderizarProductos();
        
        // Limpiar formulario y cerrar modal
        this.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalRegistrarProducto'));
        modal.hide();
        
        // Mostrar mensaje de éxito
        mostrarAlerta('Producto agregado exitosamente', 'success');
    });

    // Función para mostrar alertas
    function mostrarAlerta(mensaje, tipo) {
        const alertaDiv = document.createElement('div');
        alertaDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
        alertaDiv.style.position = 'fixed';
        alertaDiv.style.top = '20px';
        alertaDiv.style.right = '20px';
        alertaDiv.style.zIndex = '1050';
        alertaDiv.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertaDiv);
        
        setTimeout(() => {
            if (alertaDiv.parentNode) {
                alertaDiv.remove();
            }
        }, 3000);
    }

    // Inicializar
    renderizarProductos();
});