document.addEventListener('DOMContentLoaded', function() {
    // Öne çıkan ürünleri getir
    Promise.all([
        fetch('/api/products/phones').then(res => res.json()),
        fetch('/api/products/computers').then(res => res.json())
    ])
    .then(([phones, computers]) => {
        // Her kategoriden 2 ürün al
        const featuredPhones = phones.slice(0, 2);
        const featuredComputers = computers.slice(0, 2);
        const featuredProducts = [...featuredPhones, ...featuredComputers];

        const featuredGrid = document.getElementById('featuredProducts');
        featuredGrid.innerHTML = ''; // Mevcut içeriği temizle

        featuredProducts.forEach(product => {
            const productCard = `
                <div class="product-card" data-product-id="${product._id}">
                    <div class="product-image">
                        <img src="${product.image ? '/uploads/' + product.image : '/images/placeholder.jpg'}" alt="${product.title}">
                        <button class="favorite-btn" onclick="toggleFavorite(this, '${product._id}')">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <div class="product-info">
                        <h3>${product.title}</h3>
                        <p class="brand"><i class="fas fa-tag"></i> ${product.brand || 'Belirtilmemiş'}</p>
                        <p class="description">${product.description || ''}</p>
                        <p class="price">${product.price.toLocaleString('tr-TR')} TL</p>
                    </div>
                    <div class="product-actions">
                        <button class="buy-btn" onclick="addToCart('${product._id}')">
                            <i class="fas fa-shopping-cart"></i> Satın Al
                        </button>
                    </div>
                </div>
            `;
            featuredGrid.innerHTML += productCard;
        });
    })
    .catch(error => {
        console.error('Ürünler yüklenirken hata:', error);
    });
});

// Satın al fonksiyonu
function addToCart(productId) {
    window.location.href = `/checkout.html?productId=${productId}`;
}

// Favori toggle fonksiyonu
function toggleFavorite(button, productId) {
    fetch('/api/toggle-favorite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productId: productId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            button.classList.toggle('active');
            if (data.isFavorite) {
                button.querySelector('i').style.color = 'white';
                button.style.backgroundColor = '#ff4d4d';
            } else {
                button.querySelector('i').style.color = '#ccc';
                button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }
        }
    })
    .catch(error => {
        console.error('Favori işlemi sırasında hata:', error);
    });
} 