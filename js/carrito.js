function inicializarCarrito() {
    const carrito = obtenerCarrito();
    actualizarContadorCarrito(carrito);

    if (document.getElementById("productos-carrito")) {
        renderizarCarrito();
    }

    const btnPagar = document.getElementById("btn-pagar");
    if (btnPagar) {
        // Primero eliminamos cualquier listener anterior
        btnPagar.replaceWith(btnPagar.cloneNode(true));
        const nuevoBtnPagar = document.getElementById("btn-pagar");

        nuevoBtnPagar.addEventListener("click", () => {
            if (obtenerCarrito().length === 0) {
                mostrarAlerta("⚠️ Tu carrito está vacío. Agrega productos antes de pagar.", "danger");
                return;
            }
            mostrarAlerta("✅ Gracias por tu compra. Tu pedido está en camino.", "success");
            localStorage.removeItem("carritoHuertoHogar");
            renderizarCarrito();
            actualizarContadorCarrito(carrito); 
        });
}
}

function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const contenedor = document.getElementById("productos-carrito");
    const totalCompraEl = document.getElementById("total-compra");

    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        contenedor.innerHTML = `
        <section class="bg-light py-5 px-4 rounded shadow-sm">
            <h2 class="fw-bold text-primary">Tu carrito está vacío 🛒</h2>`;
        totalCompraEl.textContent = "$0";
        return;
    }

    let total = 0;

    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const item = document.createElement("div");
        item.classList.add("list-group-item", "mb-3");

        item.innerHTML = `
        <div class="row align-items-center">
            <!-- Imagen -->
            <div class="col-md-3">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid rounded">
            </div>
            <!-- Nombre, descripción y eliminar -->
            <div class="col-md-5 d-flex align-items-start">
                <div>
                    <h5>${producto.nombre}</h5>
                    <p class="text-muted">${producto.descripcion || ''}</p>
                </div>
            </div>
            <!-- Precio y cantidad -->
            <div class="col-md-4 text-end">
            <button class="btn btn-outline-danger btn-sm me-2 mb-2 btn-eliminar" data-index="${index}" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
                <p class="fw-bold subtotal">Subtotal: $${subtotal.toLocaleString()}</p>
                <input type="number" min="1" value="${producto.cantidad}" 
                    class="form-control mt-3" 
                    data-index="${index}">
            </div>
        </div>
        `;

        contenedor.appendChild(item);
    });

    totalCompraEl.textContent = "$" + total.toLocaleString();

    const inputsCantidad = document.querySelectorAll(".cantidad-input");
    inputsCantidad.forEach(input => {
        input.addEventListener("input", (e) => {
            const index = e.target.dataset.index;
            let carrito = obtenerCarrito();

            carrito[index].cantidad = parseInt(e.target.value) || 1;
            guardarCarrito(carrito);
            renderizarCarrito();
        });
    });

    const botonesEliminar = document.querySelectorAll(".btn-eliminar");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const index = e.currentTarget.dataset.index;
            let carrito = obtenerCarrito();
            carrito.splice(index, 1);
            guardarCarrito(carrito);
            renderizarCarrito();
            actualizarContadorCarrito(carrito);
        });
});
}

function aplicarCupon(cupon) {
    let descuento = 0;
    if (cupon === "HUERTO10") descuento = 0.10;
    if (cupon === "FRESH20") descuento = 0.20;
    return descuento;
}


function obtenerCarrito() {
    const carritoJSON = localStorage.getItem('carritoHuertoHogar');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carritoHuertoHogar', JSON.stringify(carrito));
}

function actualizarContadorCarrito(carrito) {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const contadores = document.querySelectorAll('.cart-count');
    contadores.forEach(contador => {
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarCarrito();
});
