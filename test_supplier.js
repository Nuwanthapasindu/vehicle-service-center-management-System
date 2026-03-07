const mongoose = require('mongoose');
const Supplier = require('./server/model/Supplier');

async function test() {
    await mongoose.connect('mongodb://127.0.0.1:27017/vehicle-service'); // Use local or mock
    const supplier = new Supplier({
        companyName: 'Test Company',
        companyMobile: ['077123', '077456'],
        items: ['60d5ec49f1b2c45d3c8b4567']
    });

    console.log('Supplier Model:', supplier.toObject());
    process.exit(0);
}

test();
