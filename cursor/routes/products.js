const express = require('express');
const router = express.Router();  // router'ı tanımla
const Product = require('../models/Product');

// Tüm ürünleri getir
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Ürünler alınamadı." });
  }
});

module.exports = router;  // router'ı doğru şekilde dışarıya aktar