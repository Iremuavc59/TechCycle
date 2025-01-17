document.addEventListener('DOMContentLoaded', function() {
    const brandFilters = document.querySelectorAll('#brandFilters input[type="checkbox"]');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const applyPriceFilterButton = document.getElementById('applyPriceFilter');

    // Filtreleme işlemini computers.js yüklendikten sonra başlat
    setTimeout(() => {
        // Tüm ürünleri saklayacağımız dizi
        let allProducts = Array.from(document.querySelectorAll('.product-card'));
        
        // Arama çubuğu için event listener ekle
        const searchInput = document.querySelector('.search-bar input');
        searchInput.addEventListener('input', function() {
            filterProducts();
        });

        function filterProducts() {
            // Seçili markaları al
            const selectedBrands = Array.from(brandFilters)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value);

            // Fiyat aralığını al
            const minPrice = minPriceInput.value;
            const maxPrice = maxPriceInput.value;
            
            // Arama metnini al
            const searchText = searchInput.value.toLowerCase().trim();
            
            // Her ürünü kontrol et
            allProducts.forEach(product => {
                const brand = product.getAttribute('data-brand').toLowerCase();
                const price = parseInt(product.getAttribute('data-price'));
                const title = product.querySelector('h3').textContent.toLowerCase();
                const description = product.querySelector('.description').textContent.toLowerCase();
                
                let showProduct = true;
                
                // Arama filtresi
                if (searchText) {
                    showProduct = title.includes(searchText) || description.includes(searchText);
                }
                
                // Marka filtresi
                if (showProduct && selectedBrands.length > 0) {
                    showProduct = selectedBrands.includes(brand);
                }
                
                // Fiyat filtresi
                if (showProduct && minPrice !== '') {
                    showProduct = price >= parseInt(minPrice);
                }
                if (showProduct && maxPrice !== '') {
                    showProduct = price <= parseInt(maxPrice);
                }
                
                // Ürünü göster/gizle
                product.style.display = showProduct ? 'block' : 'none';
            });

            // Debug için log
            console.log('Seçilen Markalar:', selectedBrands);
            console.log('Fiyat Aralığı:', minPrice, '-', maxPrice);
        }

        // Event Listeners
        brandFilters.forEach(checkbox => {
            checkbox.addEventListener('change', filterProducts);
        });
        
        // Fiyat filtresi için
        applyPriceFilterButton.addEventListener('click', filterProducts);
        
        // Sayfa yüklendiğinde tüm ürünleri göster
        allProducts.forEach(product => {
            product.style.display = 'block';
        });
        
        // Debug için log
        console.log('Filtre sistemi yüklendi');
        console.log('Toplam ürün sayısı:', allProducts.length);
    }, 1000); // 1 saniye bekle
});