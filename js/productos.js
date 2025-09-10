
document.addEventListener('DOMContentLoaded', function() {

    const productos = cargarProductos();
    console.log('Productos cargados:', productos);
    
    renderizarProductos(productos);
    
    initCategoryFilters();
    
    inicializarCarrito();
});

function cargarProductos() {
    try {

        const productosStorage = JSON.parse(localStorage.getItem('productosHuertoHogar'));
        
        if (productosStorage && productosStorage.length > 0) {
            return productosStorage;
        }
        
        if (typeof productosArray !== 'undefined' && productosArray.length > 0) {
            localStorage.setItem('productosHuertoHogar', JSON.stringify(productosArray));
            return [...productosArray];
        }

        console.warn('No se encontraron productos ni en localStorage ni en productosArray');
        return [];
    } catch (error) {
        console.error('Error al cargar productos:', error);
        
        if (typeof productosArray !== 'undefined' && productosArray.length > 0) {
            return [...productosArray];
        }
        
        return [];
    }
}

function renderizarProductos(productos) {
    const productosGrid = document.getElementById('productos-grid');
    const loading = document.getElementById('loading');
    const noProducts = document.getElementById('no-products');
    
    if (loading) loading.style.display = 'none';
    
    if (!productos || productos.length === 0) {
        if (noProducts) noProducts.style.display = 'block';
        productosGrid.innerHTML = '';
        return;
    }
    
    if (noProducts) noProducts.style.display = 'none';
    
    productosGrid.innerHTML = productos.map(producto => `
        <div class="col-md-4 mb-4 product-item" data-category="${producto.categoria}" data-name="${producto.nombre.toLowerCase()}">
            <div class="card product-card h-100">
                ${producto.oferta ? `<span class="offer-badge badge position-absolute m-2">${producto.oferta}</span>` : ''}
                <a href="detalle-producto.html?productId=${producto.id}">
                    <img src="${producto.imagen || './images/placeholder-product.jpg'}" 
                        class="card-img-top" 
                        alt="${producto.nombre}"
                        onerror="this.src='./images/placeholder-product.jpg'">
                </a>
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre} <span class="badge bg-verde">${producto.id}</span></h5>
                    <p class="card-text">${producto.descripcion || 'Producto de alta calidad'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price">$${producto.precio.toLocaleString('es-CL')} CLP</span>
                        <button class="btn btn-primary btn-agregar-carrito" data-product-id="${producto.id}">
                            <i class="bi bi-cart-plus"></i> Añadir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.btn-agregar-carrito').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            const producto = productos.find(p => p.id === productId);
            
            if (producto) {
                agregarAlCarrito(producto);
                mostrarAlerta(`¡${producto.nombre} agregado al carrito!`, 'success');
            }
        });
    });
}

function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('searchInput');
    
    if (!filterButtons.length) return;
    
    function filtrarProductos() {
        const activeCategory = Array.from(filterButtons)
            .find(btn => btn.classList.contains('active'))
            ?.getAttribute('data-category') || 'all';
        
        const searchText = searchInput ? searchInput.value.trim().toLowerCase() : '';
        
        document.querySelectorAll('.product-item').forEach(item => {
            const category = item.getAttribute('data-category');
            const name = item.getAttribute('data-name');
            
            const matchesCategory = activeCategory === 'all' || activeCategory === category;
            const matchesSearch = searchText === '' || name.includes(searchText);
            
            item.style.display = (matchesCategory && matchesSearch) ? 'block' : 'none';
        });
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filtrarProductos();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filtrarProductos);
    }
    
    filtrarProductos();
}

function mostrarAlerta(mensaje, tipo = 'info') {
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

function inicializarCarrito() {
    if (typeof actualizarContadorCarrito === 'function') {
        const carrito = obtenerCarrito();
        actualizarContadorCarrito(carrito);
    }
}