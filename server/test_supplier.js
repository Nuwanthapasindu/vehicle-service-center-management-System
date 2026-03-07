const mongoose = require('mongoose');
const Supplier = require('./model/Supplier');

async function test() {
    const supplier = new Supplier({
        companyName: 'Test Company',
        companyMobile: ['077123', '077456'],
        items: ['60d5ec49f1b2c45d3c8b4567']
    });

    console.log('Supplier Model:', supplier.toObject());
    process.exit(0);
}

test();
