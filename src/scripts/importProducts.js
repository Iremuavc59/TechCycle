const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

async function importProducts() {
    try {
        // MongoDB bağlantısı
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Atlas bağlantısı başarılı!');

        // Mevcut ürünleri temizle
        await Product.deleteMany({});
        console.log('🗑️ Eski ürünler temizlendi');

        // Laptop verilerini içe aktar
        const laptops = await parseLaptops();
        await Product.insertMany(laptops);
        console.log(`💻 ${laptops.length} laptop kaydedildi`);

        // Telefon verilerini oluştur ve kaydet
        const phones = createPhoneData();
        await Product.insertMany(phones);
        console.log(`📱 ${phones.length} telefon kaydedildi`);

        console.log('✨ Tüm veriler başarıyla kaydedildi!');
    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
    }
}

async function parseLaptops() {
    const laptops = [];
    
    return new Promise((resolve, reject) => {
        fs.createReadStream('data/laptops.csv')
            .pipe(csv())
            .on('data', (row) => {
                const laptop = {
                    title: row.Laptop,
                    brand: row.Brand,
                    model: row.Model,
                    category: 'computer',
                    condition: row.Status,
                    price: parseFloat(row['Final Price']),
                    specs: {
                        cpu: row.CPU,
                        ram: `${row.RAM}GB`,
                        storage: `${row.Storage}GB ${row['Storage type']}`,
                        gpu: row.GPU || 'Integrated Graphics',
                        screen: `${row.Screen}"`,
                        touch: row.Touch === 'Yes'
                    },
                    image: `https://picsum.photos/seed/${row.Brand}${row.Model}/400/300` // Örnek resim
                };
                laptops.push(laptop);
            })
            .on('end', () => {
                resolve(laptops);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

function createPhoneData() {
    // Örnek telefon verileri
    const phones = [
        {
            title: "iPhone 13 Pro",
            brand: "Apple",
            model: "13 Pro",
            category: "phone",
            condition: "İkinci El",
            price: 32999,
            specs: {
                storage: "256GB",
                ram: "6GB",
                screen: "6.1\"",
                camera: "Pro Camera System",
                color: "Graphite"
            },
            image: "https://picsum.photos/seed/iphone13pro/400/300"
        },
        {
            title: "Samsung Galaxy S21",
            brand: "Samsung",
            model: "S21",
            category: "phone",
            condition: "İkinci El",
            price: 19999,
            specs: {
                storage: "128GB",
                ram: "8GB",
                screen: "6.2\"",
                camera: "Triple Camera",
                color: "Phantom Gray"
            },
            image: "https://picsum.photos/seed/galaxys21/400/300"
        },
        {
            title: "Xiaomi Mi 11",
            brand: "Xiaomi",
            model: "Mi 11",
            category: "phone",
            condition: "İkinci El",
            price: 15999,
            specs: {
                storage: "256GB",
                ram: "8GB",
                screen: "6.81\"",
                camera: "108MP Camera",
                color: "Midnight Gray"
            },
            image: "https://picsum.photos/seed/mi11/400/300"
        },
        // Daha fazla telefon eklenebilir...
    ];

    return phones;
}

// Script'i çalıştır
importProducts().then(() => {
    console.log('🎉 İşlem tamamlandı!');
}).catch(error => {
    console.error('❌ İşlem başarısız:', error);
}); 