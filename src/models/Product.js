const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    originalPrice: Number,
    image: String,
    category: {
        type: String,
        enum: ['phone', 'computer']
    },
    condition: String,
    brand: String,
    specs: mongoose.Schema.Types.Mixed,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema); 