// src/scripts/seedProducts.js

const { faker } = require('@faker-js/faker');
const Product = require('../models/Product');
require('dotenv').config();
const connectDB = require('../config/db');

connectDB();

const seedProducts = async () => {
    try {

        const products = [];

        for(let i = 0; i < 200; i++) {
            products.push({
                name: faker.commerce.productName(),
                category: faker.commerce.department(),
                price: Number(faker.commerce.price()),
                stock: faker.number.int({ min: 1, max: 500 }),
                updatedAt: new Date()
            });
        }

        await Product.insertMany(products);

        console.log("Products seeded");
        process.exit();
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
};

seedProducts();