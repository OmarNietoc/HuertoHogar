

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    if (!productId) return;

    const producto = productos.find(p => p.id === productId);
    if (!producto) {
        console.error('Producto no encontrado');
        return;
    }

    document.getElementById('producto-imagen').src = producto.imagen;
    document.getElementById('producto-nombre').textContent = producto.nombre;
    document.getElementById('producto-codigo').textContent = producto.id;
    document.getElementById('producto-descripcion').textContent = producto.descripcion;
    document.getElementById('producto-precio').textContent = `$${producto.precio.toLocaleString()} CLP`;
    document.getElementById('producto-categoria').textContent = producto.categoria;

    const categoriaDescripcion = document.getElementById('producto-categoria-descripcion');


    const categoriaInfo = categorias.find(c => c.id === producto.categoria);
    if (categoriaInfo) {
        categoriaDescripcion.textContent = categoriaInfo.descripcion;
    }


const relacionadosContainer = document.getElementById('productos-relacionados');
var relacionados = productos.filter(p => p.categoria === producto.categoria && p.id !== productId);
if (relacionados.length === 0) {
    relacionados = productos.filter(p => p.categoria === 'organicos' && p.id !== productId);
}

relacionadosContainer.style.display = 'flex';
relacionadosContainer.style.overflowX = 'auto';
relacionadosContainer.style.gap = '1rem';
relacionadosContainer.style.scrollSnapType = 'x mandatory';
relacionadosContainer.style.paddingBottom = '1rem';

relacionados.forEach(p => {
    const card = document.createElement('div');
    card.classList.add('card', 'product-card');
    card.style.minWidth = '200px';
    card.style.flex = '0 0 auto';
    card.style.scrollSnapAlign = 'start';
    card.innerHTML = `
        ${p.oferta ? `<span class="offer-badge badge position-absolute m-2">${p.oferta}</span>` : ''}
        <a href="detalle-producto.html?productId=${p.id}">
            <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}" style="height: 150px; object-fit: cover;">
        </a>
        <div class="card-body p-2">
            <h6 class="card-title text-truncate" title="${p.nombre}">${p.nombre} <span class="badge bg-verde">${p.id}</span></h6>
            <div class="d-flex justify-content-between align-items-center">
                <p class="price text-verde mb-0">$${p.precio.toLocaleString()}</p>
                <a href="detalle-producto.html?productId=${p.id}">
                    <button class="btn btn-primary btn-agregar-carrito">
                        <i class="bi bi-cart-plus"></i> Añadir
                    </button>
                </a>
            </div>
        </div>
    `;
    relacionadosContainer.appendChild(card);
});

    const btnAgregar = document.querySelector('.btn-agregar-carrito');
    btnAgregar.addEventListener('click', () => {
        const cantidad = parseInt(document.getElementById('cantidad').value);
        if (isNaN(cantidad) || cantidad < 1) return;

        let carrito = JSON.parse(localStorage.getItem('carritoHuertoHogar')) || [];

        const itemIndex = carrito.findIndex(item => item.id === producto.id);
        if (itemIndex > -1) {
            carrito[itemIndex].cantidad += cantidad;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: cantidad
            });
        }

        localStorage.setItem('carritoHuertoHogar', JSON.stringify(carrito));

        const cartCount = document.querySelectorAll('.cart-count');
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        cartCount.forEach(el => el.textContent = totalItems);

        mostrarAlerta(`${cantidad} ${producto.nombre} agregado${cantidad > 1 ? 's' : ''} al carrito`, 'success');
    });
});
