const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const Product = require('./models/Ad');
const Favorite = require('./models/Favorite');
const ordersRouter = require('./routes/orders');
const favoritesRouter = require('./routes/favorites');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Multer yapılandırması
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session ayarlarını middleware'lerden sonra, route'lardan önce ekleyelim
app.use(session({
    secret: 'gizli-anahtar',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 gün
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/techcycle'
    })
}));

// MongoDB bağlantısı
try {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('✅ MongoDB Atlas bağlantısı başarılı!');
} catch (err) {
    console.error('❌ MongoDB bağlantı hatası:', err);
}

// Statik dosya servis ayarları
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Orders route'unu en başta tanımla
app.use('/api/orders', ordersRouter);

// Diğer API route'ları
app.get('/api/products/:category', async (req, res) => {
    try {
        const categoryParam = req.params.category;
        const categoryMapping = {
            'phones': 'phone',
            'computers': 'computer'
        };
        const category = categoryMapping[categoryParam] || categoryParam;
        const products = await Product.find({ category: category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/post-ad', upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, category, brand } = req.body;
        const image = req.file ? req.file.filename : null;

        const newProduct = new Product({
            title,
            description,
            price: Number(price),
            category,
            image,
            brand
        });

        await newProduct.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API Routes
app.get('/api/ads/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
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

// API Routes
app.use('/api/favorites', favoritesRouter);

// HTML route'ları
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/phones', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'phones.html'));
});

app.get('/computers', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'computers.html'));
});

app.get('/post-ad', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'post-ad.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'orders.html'));
});

app.get('/favorites', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favorites.html'));
});

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'account-settings.html'));
});

app.get('/logout', (req, res) => {
    res.redirect('/');
});

// En son genel route'u ekle
app.use('/', ordersRouter);

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`🚀 Sunucu çalışıyor: http://localhost:${port}`);
});

// Hata yakalama
process.on('unhandledRejection', (error) => {
    console.error('Beklenmeyen hata:', error);
});