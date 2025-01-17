const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Test için geçici kullanıcı ID'si
const testUserId = new ObjectId();

// Siparişleri getirme endpoint'i
router.get('/', async (req, res) => {
    try {
        console.log('Siparişler getiriliyor...'); // Debug için

        // Orders koleksiyonundan siparişleri al
        const orders = await mongoose.connection.db.collection('orders').find().toArray();
        console.log('Ham siparişler:', orders); // Debug için

        // Her sipariş için ürün bilgilerini getir
        const formattedOrders = orders.map(order => {
            return {
                _id: order._id,
                title: order.title || 'Ürün Adı',
                brand: order.brand || 'Marka',
                price: order.price,
                status: order.status || 'pending',
                paymentMethod: order.paymentMethod,
                address: order.address,
                createdAt: order.createdAt,
                image: order.image,
                fullName: order.fullName,
                phone: order.phone,
                product: {
                    title: order.title || 'Ürün Adı',
                    brand: order.brand || 'Marka',
                    image: order.image,
                    price: order.price
                }
            };
        });

        console.log('Formatlanmış siparişler:', formattedOrders); // Debug için
        res.json(formattedOrders);
    } catch (error) {
        console.error('Siparişler getirilirken hata:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Siparişler yüklenirken bir hata oluştu',
            error: error.message 
        });
    }
});

// Sipariş oluşturma endpoint'i
router.post('/create', async (req, res) => {
    try {
        const { productId, paymentMethod, address, fullName, phone, cardDetails } = req.body;
        console.log('Gelen sipariş verisi:', req.body); // Debug için

        // Ürünü products koleksiyonundan kontrol et
        const product = await mongoose.connection.db.collection('products').findOne({
            _id: new ObjectId(productId)
        });
        console.log('Bulunan ürün:', product); // Debug için

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ürün bulunamadı' 
            });
        }

        // Yeni sipariş verisi - ürün bilgilerini de kaydet
        const orderData = {
            product: new ObjectId(productId),
            user: testUserId,
            paymentMethod,
            address,
            fullName,
            phone,
            status: 'pending',
            price: product.price,
            cardDetails: paymentMethod === 'card' ? {
                cardNumber: cardDetails?.cardNumber?.slice(-4)
            } : null,
            createdAt: new Date(),
            // Ürün bilgilerini direkt olarak kaydet
            title: product.title,
            brand: product.brand,
            image: product.image,
            description: product.description
        };

        // Siparişi orders koleksiyonuna ekle
        const result = await mongoose.connection.db.collection('orders').insertOne(orderData);
        console.log('Sipariş kaydedildi:', result); // Debug için

        // Ürünü products koleksiyonundan sil
        const deleteResult = await mongoose.connection.db.collection('products').deleteOne({ 
            _id: new ObjectId(productId) 
        });
        console.log('Silme işlemi sonucu:', deleteResult); // Debug için

        // Favorilerden de sil
        const favoriteDeleteResult = await mongoose.connection.db.collection('favorites').deleteMany({ 
            product: new ObjectId(productId) 
        });
        console.log('Favorilerden silme sonucu:', favoriteDeleteResult); // Debug için

        res.json({ 
            success: true, 
            message: 'Sipariş başarıyla oluşturuldu',
            orderId: result.insertedId
        });

    } catch (error) {
        console.error('Sipariş oluşturma hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Sipariş oluşturulurken bir hata oluştu',
            error: error.message
        });
    }
});

module.exports = router;