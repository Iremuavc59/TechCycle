const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');

// Ürün detaylarını getirme endpoint'i
router.get('/api/products/getProduct/:id', async (req, res) => {
    try {
        const product = await Ad.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ürün bulunamadı' 
            });
        }
        res.json(product);
    } catch (error) {
        console.error('Ürün getirme hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ürün bilgileri alınırken bir hata oluştu' 
        });
    }
});

module.exports = router; 