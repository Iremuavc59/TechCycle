const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    category: String,
    // Yeni alanlar
    asin: String,
    rating: Number,
    totalReviews: Number,
    imageUrl: String,
    productUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);