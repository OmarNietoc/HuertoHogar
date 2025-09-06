document.addEventListener('DOMContentLoaded', () => {
    initCategoryFilters(); 
});

function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.category-btn');
    const products = document.querySelectorAll('.product-item');
    const searchInput = document.getElementById('searchInput'); // Puede no existir

    if (!filterButtons.length || !products.length) return;

    const allBtn = document.querySelector('.category-btn[data-category="all"]');

    function updateProducts() {
        const activeCategories = Array.from(filterButtons)
            .filter(btn => btn.classList.contains('active'))
            .map(btn => btn.getAttribute('data-category'));

        const searchText = searchInput ? searchInput.value.trim().toLowerCase() : '';

        products.forEach(product => {
            const productCategory = product.getAttribute('data-category');
            const productName = product.querySelector('.card-title').textContent.toLowerCase();

            const matchesCategory =
                activeCategories.length === 0 ||
                activeCategories.includes('all') ||
                activeCategories.includes(productCategory);

            const matchesSearch =
                searchText === '' || productName.includes(searchText);

            product.style.display = (matchesCategory && matchesSearch) ? 'block' : 'none';
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');

            if (category === 'all') {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            } else {
                if (allBtn.classList.contains('active')) allBtn.classList.remove('active');
                this.classList.toggle('active');
            }

            updateProducts();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', updateProducts);
    }

    updateProducts();
}

