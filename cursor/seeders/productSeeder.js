const mongoose = require('mongoose');

const fs = require('fs');

const csv = require('csv-parser');

const Product = require('../models/Product');

const Product2 = require('../models/Product2');

const dotenv = require('dotenv');

const path = require('path');

// Yeni CSV dosya yolları
const dataset1Path = path.join(__dirname, '..', 'data', 'laptops.csv');
const dataset2Path = path.join(__dirname, '..', 'data', 'TrendyolSmartPhone.csv');

dotenv.config();

const importCSV = async (filePath, isLaptop = true) => {
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                if (results.length === 0) {
                    console.log(`\n${isLaptop ? 'Laptop' : 'Telefon'} CSV Sütunları:`, Object.keys(data));
                    console.log('İlk Veri Örneği:', data);
                }
                results.push(data);
            })
            .on('end', () => {
                console.log(`CSV dosyasında toplam ${results.length} satır bulundu.`);
                
                const formattedData = results.map((item, index) => {
                    if (isLaptop) {
                        if (!item.Laptop) {
                            console.log(`Uyarı: ${index + 1}. satırda laptop adı eksik:`, item);
                            return null;
                        }
                        return {
                            name: item.Laptop.trim(),
                            price: parseFloat(item['Final Price']) || 0,
                            description: `Brand: ${item.Brand}, Model: ${item.Model}, CPU: ${item.CPU}, RAM: ${item.RAM}GB, Storage: ${item.Storage}GB ${item['Storage type']}, GPU: ${item.GPU}, Screen: ${item.Screen}", Touch: ${item.Touch}`,
                            category: 'Laptop',
                            asin: `${item.Brand}-${item.Model}`,
                            rating: 0,
                            totalReviews: 0,
                            imageUrl: '',
                            productUrl: ''
                        };
                    } else {
                        if (!item['Urun Başlığı']) {
                            console.log(`Uyarı: ${index + 1}. satırda telefon adı eksik:`, item);
                            return null;
                        }
                        const price = parseFloat(item.Fiyat?.replace(' TL', '').replace('.', '').replace(',', '.')) || 0;
                        return {
                            name: item['Urun Başlığı'].trim(),
                            price: price,
                            description: `Marka: ${item.Marka}, İşletim Sistemi: ${item['İşletim Sistemi']}, Hafıza: ${item['Dahili Hafıza']}, RAM: ${item['RAM Kapasitesi']}, Ekran: ${item['Ekran Boyutu']}, Kamera: ${item['Kamera Çözünürlüğü']}, Batarya: ${item['Batarya Kapasitesi Aralığı']}`,
                            category: 'Smartphone',
                            asin: item.Link?.split('-p-')[1] || '',
                            rating: 0,
                            totalReviews: 0,
                            imageUrl: '',
                            productUrl: item.Link || ''
                        };
                    }
                }).filter(item => item !== null); // Geçersiz verileri filtrele

                console.log(`${formattedData.length} geçerli veri dönüştürüldü.`);
                resolve(formattedData);
            })
            .on('error', (error) => reject(error));
    });
};

const seedDatabase = async () => {
    try {
        // Dosyaların varlığını kontrol et
        if (!fs.existsSync(dataset1Path)) {
            throw new Error(`laptops.csv dosyası bulunamadı: ${dataset1Path}`);
        }
        if (!fs.existsSync(dataset2Path)) {
            throw new Error(`TrendyolSmartPhone.csv dosyası bulunamadı: ${dataset2Path}`);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB bağlantısı başarılı 🌟');

        // Önce mevcut verileri temizle
        await Product.deleteMany({});
        await Product2.deleteMany({});
        console.log('Eski veriler temizlendi');

        // Dataset'leri oku ve kaydet
        console.log('\n=== Laptop Verilerini İşleme ===');
        const dataset1 = await importCSV(dataset1Path, true);
        const laptopResult = await Product.insertMany(dataset1);
        console.log(`Dataset 1'den ${laptopResult.length} laptop başarıyla eklendi!`);

        console.log('\n=== Telefon Verilerini İşleme ===');
        const dataset2 = await importCSV(dataset2Path, false);
        const phoneResult = await Product2.insertMany(dataset2);
        console.log(`Dataset 2'den ${phoneResult.length} telefon başarıyla eklendi!`);

        console.log('\n=== Özet ===');
        console.log('Toplam Laptop sayısı:', await Product.countDocuments());
        console.log('Toplam Telefon sayısı:', await Product2.countDocuments());

        process.exit();
    } catch (error) {
        console.error('Hata:', error.message);
        process.exit(1);
    }
};

seedDatabase();
