const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kullanıcı kontrolü
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Şifre kontrolü
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Hatalı şifre' });
        }

        // Token oluşturma
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, city } = req.body;

        // Email kontrolü
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Bu email zaten kayıtlı' });
        }

        // Şifre hashleme
        const hashedPassword = await bcrypt.hash(password, 10);

        // Yeni kullanıcı oluşturma
        user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            city
        });

        await user.save();

        // Token oluşturma
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

module.exports = router; 