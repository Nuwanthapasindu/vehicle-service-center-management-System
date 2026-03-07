const axios = require('axios');

async function testApi() {
    try {
        // 1. Get a supplier
        const supRes = await axios.get('http://127.0.0.1:4000/suppliers');
        const sup = supRes.data[0];
        if (!sup) {
            console.log('No suppliers found');
            return;
        }

        // 2. Get inventory
        const invRes = await axios.get('http://127.0.0.1:4000/inventory');
        const inv = invRes.data[0];
        if (!inv) {
            console.log('No inventory found');
            return;
        }

        // 3. Place order
        const orderData = {
            supplier: sup._id,
            items: [{
                itemId: inv._id,
                qty: 5,
                unitType: inv.unitType || 'Count',
                cost: inv.buyingPrice || 0
            }],
            totalCost: (inv.buyingPrice || 0) * 5,
            status: 'Sent'
        };

        console.log('Sending Order:', JSON.stringify(orderData, null, 2));

        const postRes = await axios.post('http://127.0.0.1:4000/orders', orderData);
        console.log('Success:', postRes.data);
    } catch (err) {
        if (err.response) {
            console.log('API Error:', JSON.stringify(err.response.data, null, 2));
        } else {
            console.log('Network Error:', err.message);
        }
    }
}

testApi();
