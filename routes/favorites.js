const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const mongoose = require('mongoose');

// Test için geçici kullanıcı ID'si
const testUserId = new mongoose.Types.ObjectId();

// Favorileri getir
router.get('/', async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: testUserId })
            .populate({
                path: 'product',
                model: 'Ad'
            });
        console.log('Bulunan favoriler:', favorites); // Debug için
        res.json(favorites);
    } catch (error) {
        console.error('Favoriler getirilirken hata:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Favoriler yüklenirken bir hata oluştu' 
        });
    }
});

// Favori ekle/kaldır
router.post('/toggle', async (req, res) => {
    try {
        const { productId } = req.body;
        console.log('Gelen productId:', productId); // Debug için

        // Favori var mı kontrol et
        const existingFavorite = await Favorite.findOne({
            user: testUserId,
            product: productId
        });

        if (existingFavorite) {
            // Favori varsa kaldır
            await Favorite.findByIdAndDelete(existingFavorite._id);
            console.log('Favori kaldırıldı'); // Debug için
            res.json({ 
                success: true, 
                isFavorite: false,
                message: 'Ürün favorilerden kaldırıldı' 
            });
        } else {
            // Favori yoksa ekle
            const newFavorite = new Favorite({
                user: testUserId,
                product: productId
            });
            await newFavorite.save();
            console.log('Yeni favori eklendi:', newFavorite); // Debug için
            res.json({ 
                success: true, 
                isFavorite: true,
                message: 'Ürün favorilere eklendi' 
            });
        }
    } catch (error) {
        console.error('Favori işlemi sırasında hata:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Favori işlemi sırasında bir hata oluştu' 
        });
    }
});

// Favori durumunu kontrol et
router.get('/check/:productId', async (req, res) => {
    try {
        const favorite = await Favorite.findOne({
            user: testUserId,
            product: req.params.productId
        });
        res.json({ isFavorite: !!favorite });
    } catch (error) {
        console.error('Favori durumu kontrol edilirken hata:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Favori durumu kontrol edilirken bir hata oluştu' 
        });
    }
});

module.exports = router; 