const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ad',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['card', 'cash']
    },
    address: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    },
    price: {
        type: Number,
        required: true
    },
    cardDetails: {
        cardNumber: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'orders' });

module.exports = mongoose.model('Order', orderSchema);