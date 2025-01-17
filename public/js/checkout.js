// Kart numarası formatlama fonksiyonu
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = value;
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // URL'den ürün ID'sini al
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('productId');
        
        console.log('Ürün ID:', productId); // Debug için

        if (!productId) {
            window.location.href = '/';
            return;
        }

        // Ödeme yöntemi değişikliğini dinle
        const paymentMethodInputs = document.querySelectorAll('input[name="paymentMethod"]');
        const cardPaymentDetails = document.getElementById('cardPaymentDetails');

        paymentMethodInputs.forEach(input => {
            input.addEventListener('change', function() {
                if (this.value === 'card') {
                    cardPaymentDetails.style.display = 'block';
                    cardPaymentDetails.querySelectorAll('input').forEach(input => {
                        input.required = true;
                    });
                } else {
                    cardPaymentDetails.style.display = 'none';
                    cardPaymentDetails.querySelectorAll('input').forEach(input => {
                        input.required = false;
                    });
                }
            });
        });

        // Ürün detaylarını getir ve göster
        try {
            console.log('Ürün ID:', productId); // Debug için
            const response = await fetch(`/api/ads/${productId}`);
            console.log('API Yanıtı:', response); // Debug için
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ürün bulunamadı');
            }
            
            const product = await response.json();
            console.log('Gelen ürün bilgileri:', product); // Debug için
            
            if (!product) {
                throw new Error('Ürün bilgileri boş');
            }

            const productDetails = document.getElementById('productDetails');
            productDetails.innerHTML = `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image ? '/uploads/' + product.image : '/images/placeholder.jpg'}" 
                             alt="${product.title}"
                             onerror="this.src='/images/placeholder.jpg'"
                             class="product-img">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.title || 'İsimsiz Ürün'}</h3>
                        <div class="product-details">
                            <p class="brand"><strong>Marka:</strong> ${product.brand || 'Belirtilmemiş'}</p>
                            <p class="condition"><strong>Durumu:</strong> ${product.condition || 'Belirtilmemiş'}</p>
                            <p class="description"><strong>Açıklama:</strong> ${product.description || 'Açıklama bulunmuyor'}</p>
                            <p class="price"><strong>Fiyat:</strong> ${product.price.toLocaleString('tr-TR')} TL</p>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Ürün bilgileri yüklenirken hata:', error);
            document.getElementById('productDetails').innerHTML = `
                <div class="error-message">
                    <p><i class="fas fa-exclamation-circle"></i></p>
                    <p>Ürün bilgileri yüklenirken bir hata oluştu.</p>
                    <p>${error.message}</p>
                </div>
            `;
        }

        // Form gönderildiğinde
        const paymentForm = document.getElementById('paymentForm');
        paymentForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                const formData = new FormData(this);
                const orderData = {
                    productId: productId,
                    paymentMethod: formData.get('paymentMethod'),
                    address: formData.get('address'),
                    fullName: formData.get('fullName'),
                    phone: formData.get('phone')
                };

                // Kart ile ödeme seçiliyse kart bilgilerini ekle
                if (formData.get('paymentMethod') === 'card') {
                    const cardNumber = formData.get('cardNumber').replace(/\s/g, '');
                    orderData.cardDetails = {
                        cardNumber: cardNumber,
                        expiry: formData.get('expiry'),
                        cvv: formData.get('cvv')
                    };
                }

                console.log('Gönderilecek sipariş verisi:', orderData); // Debug için

                const response = await fetch('/api/orders/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();
                console.log('Sipariş sonucu:', result); // Debug için

                if (result.success) {
                    await Swal.fire({
                        title: 'Başarılı!',
                        text: 'Siparişiniz başarıyla oluşturuldu.',
                        icon: 'success',
                        confirmButtonText: 'Tamam'
                    });
                    
                    window.location.href = '/orders';
                } else {
                    throw new Error(result.message || 'Sipariş oluşturulurken bir hata oluştu');
                }
            } catch (error) {
                console.error('Sipariş hatası:', error);
                Swal.fire({
                    title: 'Hata!',
                    text: error.message,
                    icon: 'error',
                    confirmButtonText: 'Tamam'
                });
            }
        });

    } catch (error) {
        console.error('Genel hata:', error);
        document.getElementById('productDetails').innerHTML = `
            <div class="error-message">
                <p>Bir hata oluştu.</p>
                <p>${error.message}</p>
            </div>
        `;
    }
});