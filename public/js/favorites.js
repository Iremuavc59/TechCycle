document.addEventListener('DOMContentLoaded', function() {
    // Favorileri getir
    fetch('/api/favorites')
        .then(response => response.json())
        .then(favorites => {
            const favoriteGrid = document.getElementById('favoriteProducts');
            favoriteGrid.innerHTML = '';

            if (favorites.length === 0) {
                favoriteGrid.innerHTML = `
                    <div class="no-favorites">
                        <i class="fas fa-heart"></i>
                        <p>Henüz favori ürününüz bulunmamaktadır.</p>
                        <a href="/" class="btn-primary">Alışverişe Başla</a>
                    </div>
                `;
                return;
            }

            favorites.forEach(favorite => {
                const product = favorite.product;
                const productCard = `
                    <div class="product-card" data-product-id="${product._id}">
                        <div class="product-image">
                            <img src="${product.image ? '/uploads/' + product.image : '/images/placeholder.jpg'}" 
                                 alt="${product.title}"
                                 onerror="this.src='/images/placeholder.jpg'">
                            <button class="favorite-btn active" onclick="toggleFavorite(this, '${product._id}')">
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
                favoriteGrid.innerHTML += productCard;
            });
        })
        .catch(error => {
            console.error('Favoriler yüklenirken hata:', error);
            document.getElementById('favoriteProducts').innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Favoriler yüklenirken bir hata oluştu.</p>
                    <p>${error.message}</p>
                </div>
            `;
        });
});

// Favori toggle fonksiyonu
function toggleFavorite(button, productId) {
    fetch('/api/favorites/toggle', {
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
            if (!data.isFavorite) {
                // Favorilerden kaldırıldıysa, ürün kartını kaldır
                const productCard = button.closest('.product-card');
                productCard.remove();

                // Eğer başka favori ürün kalmadıysa, "favori yok" mesajını göster
                const favoriteGrid = document.getElementById('favoriteProducts');
                if (favoriteGrid.children.length === 0) {
                    favoriteGrid.innerHTML = `
                        <div class="no-favorites">
                            <i class="fas fa-heart"></i>
                            <p>Henüz favori ürününüz bulunmamaktadır.</p>
                            <a href="/" class="btn-primary">Alışverişe Başla</a>
                        </div>
                    `;
                }
            }
        }
    })
    .catch(error => {
        console.error('Favori işlemi sırasında hata:', error);
    });
}

// Satın al fonksiyonu
function addToCart(productId) {
    window.location.href = `/checkout.html?productId=${productId}`;
} 