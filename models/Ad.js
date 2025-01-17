const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String },
    condition: { type: String },
    brand: { type: String },
    status: { 
        type: String, 
        enum: ['active', 'sold'],
        default: 'active'
    },
    specs: { type: Object },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ad', productSchema, 'products'); 