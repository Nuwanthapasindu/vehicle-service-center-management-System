const axios = require('axios');

async function testApi() {
    try {
        console.log('Fetching inventory...');
        const invRes = await axios.get('http://127.0.0.1:4000/api/inventory');

        if (!invRes.data || invRes.data.length === 0) {
            console.log('No inventory found. Creating a dummy supplier with manual items.');
            var testItems = ['Brake Pads', 'Engine Oil'];
        } else {
            console.log(`Found ${invRes.data.length} inventory items. Using the first two.`);
            var testItems = invRes.data.slice(0, 2).map(i => i.name);
        }

        const supplierData = {
            companyName: 'Database Test Supplier ' + Date.now(),
            agentName: 'Test Agent',
            companyMobile: ['0771234567'],
            items: testItems
        };

        console.log('Sending Supplier Data:', JSON.stringify(supplierData, null, 2));

        const postRes = await axios.post('http://127.0.0.1:4000/api/suppliers', supplierData);
        console.log('Success Creating Supplier:', postRes.data);

        // Verify it was saved correctly by fetching again
        const getRes = await axios.get(`http://127.0.0.1:4000/suppliers/${postRes.data._id}`);
        // But the controller only has getAllSuppliers: `axios.get('http://127.0.0.1:4000/suppliers')`

        const allSupRes = await axios.get('http://127.0.0.1:4000/api/suppliers');
        const createdSup = allSupRes.data.find(s => s._id === postRes.data._id);

        console.log('\nVerified Supplier fetched from DB:');
        console.log(JSON.stringify(createdSup, null, 2));

    } catch (err) {
        if (err.response) {
            console.log('API Error:', JSON.stringify(err.response.data, null, 2));
        } else {
            console.log('Network Error:', err.message);
        }
    }
}

testApi();
