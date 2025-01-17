document.addEventListener('DOMContentLoaded', function() {
    console.log('Siparişler sayfası yükleniyor...'); // Debug için

    // Siparişleri getir
    fetch('/api/orders')
        .then(response => {
            console.log('API yanıtı:', response.status); // Debug için
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(orders => {
            console.log('Gelen siparişler:', orders); // Debug için
            const ordersList = document.getElementById('ordersList');
            
            if (!orders || orders.length === 0) {
                ordersList.innerHTML = `
                    <div class="no-orders">
                        <i class="fas fa-shopping-bag"></i>
                        <p>Henüz siparişiniz bulunmamaktadır.</p>
                        <a href="/" class="btn-primary">Alışverişe Başla</a>
                    </div>
                `;
                return;
            }

            ordersList.innerHTML = ''; // Önceki içeriği temizle
            
            orders.forEach(order => {
                if (!order.product) {
                    console.warn('Ürün bilgisi eksik:', order);
                    return;
                }

                const orderDate = new Date(order.createdAt).toLocaleDateString('tr-TR');
                const orderItem = `
                    <div class="order-item">
                        <div class="order-image">
                            <img src="${order.product.image ? '/uploads/' + order.product.image : '/images/placeholder.jpg'}" 
                                 alt="${order.product.title}"
                                 onerror="this.src='/images/placeholder.jpg'">
                        </div>
                        <div class="order-details">
                            <h3>${order.product.title}</h3>
                            <p class="brand"><i class="fas fa-tag"></i> ${order.product.brand || 'Belirtilmemiş'}</p>
                            <p class="price">${order.price.toLocaleString('tr-TR')} TL</p>
                            <p class="order-date"><i class="fas fa-calendar"></i> ${orderDate}</p>
                            <p class="delivery-address">
                                <i class="fas fa-map-marker-alt"></i> 
                                ${order.address}
                            </p>
                        </div>
                        <div class="order-status ${order.status}">
                            <span class="status-badge">
                                ${getStatusText(order.status)}
                            </span>
                            <p class="payment-method">
                                <i class="fas ${order.paymentMethod === 'card' ? 'fa-credit-card' : 'fa-money-bill'}"></i>
                                ${order.paymentMethod === 'card' ? 'Kredi Kartı' : 'Kapıda Ödeme'}
                            </p>
                        </div>
                    </div>
                `;
                ordersList.innerHTML += orderItem;
            });
        })
        .catch(error => {
            console.error('Siparişler yüklenirken hata:', error);
            document.getElementById('ordersList').innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Siparişler yüklenirken bir hata oluştu.</p>
                    <p>${error.message}</p>
                </div>
            `;
        });
});

// Sipariş durumu metinleri
function getStatusText(status) {
    const statusTexts = {
        'pending': 'Beklemede',
        'processing': 'İşleniyor',
        'shipped': 'Kargoda',
        'delivered': 'Teslim Edildi',
        'cancelled': 'İptal Edildi'
    };
    return statusTexts[status] || 'Beklemede';
} 