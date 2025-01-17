const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Ürün adı
  price: { type: Number, required: true }, // Fiyat
  description: { type: String, required: true }, // Açıklama
  category: { type: String, required: true }, // Kategori
  asin: { type: String, required: true, unique: true }, // ASIN kodu
  productUrl: { type: String, required: true }, // Ürün URL'si
  imageUrl: { type: String, required: true }, // Ürün görseli için URL
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
