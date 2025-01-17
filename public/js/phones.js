document.addEventListener('DOMContentLoaded', function() {
    // API'den telefon ilanlarını al
    fetch('/api/products/phones')
        .then(response => response.json())
        .then(products => {
            const productsGrid = document.getElementById('phoneProducts');
            productsGrid.innerHTML = '';
            
            products.forEach(product => {
                const productCard = `
                    <div class="product-card" 
                         data-product-id="${product._id}"
                         data-brand="${product.brand.toLowerCase()}"
                         data-price="${product.price}">
                        <div class="product-image">
                            <img src="${product.image ? '/uploads/' + product.image : '/images/placeholder.jpg'}" alt="${product.title}">
                            <button class="favorite-btn" onclick="toggleFavorite(this, '${product._id}')">
                                <i class="far fa-heart"></i>
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
                productsGrid.innerHTML += productCard;
            });

            // Favori durumlarını kontrol et ve uygula
            loadFavoriteStates();
        })
        .catch(error => {
            console.error('Ürünler yüklenirken hata:', error);
        });
});

// Favori durumlarını yükle
function loadFavoriteStates() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productId = card.dataset.productId;
        const favoriteButton = card.querySelector('.favorite-btn');
        const heartIcon = favoriteButton.querySelector('i');
        
        fetch(`/api/favorites/check/${productId}`)
            .then(response => response.json())
            .then(data => {
                if (data.isFavorite) {
                    favoriteButton.classList.add('active');
                    heartIcon.style.color = '#ff0000';
                    heartIcon.classList.remove('far');
                    heartIcon.classList.add('fas');
                } else {
                    heartIcon.classList.remove('fas');
                    heartIcon.classList.add('far');
                }
            })
            .catch(error => {
                console.error('Favori durumu kontrol edilirken hata:', error);
            });
    });
}

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
            const heartIcon = button.querySelector('i');
            button.classList.toggle('active');
            
            if (data.isFavorite) {
                // Favorilere eklendiğinde
                heartIcon.style.color = '#ff0000';
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
            } else {
                // Favorilerden çıkarıldığında
                heartIcon.style.color = '#ccc';
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
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

// Sayfa yüklendiğinde favori durumlarını kontrol et
document.addEventListener('DOMContentLoaded', function() {
    loadFavoriteStates();
}); 