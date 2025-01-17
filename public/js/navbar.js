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
    
    if (profileButton) {
        profileButton.addEventListener('click', () => {
            profileDropdown.classList.toggle('show');
        });
        profileButton.parentNode.appendChild(profileDropdown);
    }

    // İlan Ver butonu
    const postAdButton = document.querySelector('.btn-primary');
    if (postAdButton) {
        postAdButton.addEventListener('click', () => {
            window.location.href = '/post-ad';
        });
    }

    // Arama fonksiyonu
    const searchForm = document.querySelector('.search-bar');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchInput = searchForm.querySelector('input');
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

    // Logo tıklama
    const logo = document.querySelector('.logo a');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/';
        });
    }

    // Döküman tıklamalarını dinle (dropdown menüyü kapatmak için)
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.profile-dropdown')) {
            profileDropdown.classList.remove('show');
        }
    });
}); 