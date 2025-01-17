document.addEventListener('DOMContentLoaded', () => {
    // Profil dropdown menüsü
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

    // Kategori kartları için click eventi
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.classList.contains('phones') ? 'phones' : 'computers';
            window.location.href = `/${category}`;
        });
    });

    // Sepete Ekle butonları
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const price = productCard.querySelector('.discounted-price').textContent;
            
            // Sepete ekleme animasyonu
            button.innerHTML = '<i class="fas fa-check"></i> Sepete Eklendi';
            button.classList.add('added');
            
            setTimeout(() => {
                button.innerHTML = 'Sepete Ekle';
                button.classList.remove('added');
            }, 2000);
        });
    });

    // Arama fonksiyonu
    const searchForm = document.querySelector('.search-bar');
    const searchInput = searchForm.querySelector('input');
    
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
        }
    });

    // İlan Ver butonu
    const postAdButton = document.querySelector('.btn-primary');
    postAdButton.addEventListener('click', () => {
        window.location.href = '/post-ad';
    });

    
}); 