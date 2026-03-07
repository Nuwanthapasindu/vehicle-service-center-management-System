const mongoose = require('mongoose');
const Supplier = require('./model/Supplier');
const Inventory = require('./model/Inventory');
const PurchaseOrder = require('./model/PurchaseOrder');

async function test() {
    await mongoose.connect('mongodb://127.0.0.1:27017/vehicle-service'); // Use local or mock

    const supplier = new Supplier({
        companyName: 'Test Company',
        companyMobile: ['077123', '077456'],
        items: []
    });
    await supplier.save();

    const inv = new Inventory({
        name: 'Wiper Blade',
        category: new mongoose.Types.ObjectId(), // mock
        qty: 0,
        unitType: 'Count',
        sellingPrice: 1500,
        buyingPrice: 1000
    });
    await inv.save();

    const orderData = {
        supplier: supplier._id,
        items: [{
            itemId: inv._id,
            qty: 5,
            unitType: inv.unitType,
            cost: inv.buyingPrice
        }],
        totalCost: 5000,
        status: 'Sent'
    };

    try {
        const order = new PurchaseOrder(orderData);
        await order.save();
        console.log('Order created!', order.toObject());
    } catch (e) {
        console.error('Order creation failed:', e.message);
    }

    process.exit(0);
}

test();
