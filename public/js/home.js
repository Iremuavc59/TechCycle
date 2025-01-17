document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Öne çıkan ürünleri getir
        const [phonesResponse, computersResponse] = await Promise.all([
            fetch('/api/products/phone'),
            fetch('/api/products/computer')
        ]);

        const phones = await phonesResponse.json();
        const computers = await computersResponse.json();

        // Her kategoriden en popüler 2 ürünü seç
        const featuredProducts = [
            ...phones.slice(0, 2),
            ...computers.slice(0, 2)
        ];

        displayFeaturedProducts(featuredProducts);
    } catch (error) {
        console.error('Veri yüklenirken hata:', error);
    }

    // Profil dropdown menüsünü kur
    setupProfileDropdown();
});

function displayFeaturedProducts(products) {
    const container = document.getElementById('featuredProducts');
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title}">
            <div class="content">
                <h3>${product.title}</h3>
                <div class="specs">
                    ${product.category === 'phone' ? `
                        <p><i class="fas fa-mobile-alt"></i> ${product.specs.storage}</p>
                        <p><i class="fas fa-memory"></i> ${product.specs.ram}</p>
                    ` : `
                        <p><i class="fas fa-microchip"></i> ${product.specs.cpu}</p>
                        <p><i class="fas fa-memory"></i> ${product.specs.ram}</p>
                    `}
                </div>
                <div class="price">
                    <span class="discounted-price">${product.price.toLocaleString('tr-TR')} TL</span>
                </div>
                <button class="add-to-cart">
                    <i class="fas fa-shopping-cart"></i> Sepete Ekle
                </button>
            </div>
        </div>
    `).join('');
}

function setupProfileDropdown() {
    const profileButton = document.querySelector('.profile-dropdown button');
    const profileDropdown = document.createElement('div');
    profileDropdown.className = 'dropdown-menu';
    profileDropdown.innerHTML = `
        <a href="/profile"><i class="fas fa-user"></i> Profilim</a>
        <a href="/orders"><i class="fas fa-box"></i> Siparişlerim</a>
        <a href="/favorites"><i class="fas fa-heart"></i> Favorilerim</a>
        <a href="/settings"><i class="fas fa-cog"></i> Ayarlar</a>
        <a href="/logout" class="logout"><i class="fas fa-sign-out-alt"></i> Çıkış Yap</a>
    `;
    
    profileButton.addEventListener('click', () => {
        profileDropdown.classList.toggle('show');
    });
    
    profileButton.parentNode.appendChild(profileDropdown);
}

function addToFavorites(productId) {
    // Favorilere ekleme işlemi için bir API çağrısı yapın
    fetch('/api/add-to-favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: productId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Ürün favorilere eklendi!');
        } else {
            alert('Ürün favorilere eklenemedi.');
        }
    })
    .catch(error => console.error('Hata:', error));
} 