function inicializarCarrito() {
    // Cargar carrito desde localStorage
    const carrito = obtenerCarrito();
    actualizarContadorCarrito(carrito.length);
    
    // Configurar eventos del carrito
    const botonesCarrito = document.querySelectorAll('.btn-agregar-carrito');
    botonesCarrito.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
}

function obtenerCarrito() {
    const carritoJSON = localStorage.getItem('carritoHuertoHogar');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carritoHuertoHogar', JSON.stringify(carrito));
}

function agregarAlCarrito(e) {
    const boton = e.currentTarget;
    const card = boton.closest('.card');
    const productoId = card.dataset.productoId || generarIdProducto();
    const productoNombre = card.querySelector('.card-title').textContent;
    const productoPrecio = card.querySelector('.price').textContent;
    const productoImagen = card.querySelector('.card-img-top').src;
    
    const producto = {
        id: productoId,
        nombre: productoNombre,
        precio: productoPrecio,
        imagen: productoImagen,
        cantidad: 1
    };
    
    let carrito = obtenerCarrito();
    const productoExistente = carrito.find(item => item.id === productoId);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push(producto);
    }
    
    guardarCarrito(carrito);
    actualizarContadorCarrito(carrito.length);
    
    mostrarAlerta(`¡${productoNombre} agregado al carrito!`, 'success');
}

function actualizarContadorCarrito(cantidad) {
    const contadores = document.querySelectorAll('.cart-count');
    contadores.forEach(contador => {
        contador.textContent = cantidad;
        contador.style.display = cantidad > 0 ? 'flex' : 'none';
    });
}

function generarIdProducto() {
    return 'prod_' + Math.random().toString(36).substr(2, 9);
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarCarrito();
});
