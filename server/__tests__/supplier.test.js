// npm test
const { validateSupplier } = require('../validation/supplier.validation');
describe('Supply Chain - Supplier Unit Tests', () => {

    // TEST CASE 1: Testing with 100% correct data
    it('should pass when a valid supplier object is provided', () => {
        
        const validSupplier = {
            companyName: 'AMW Genuine Parts',
            agentName: 'Anura Perera',
            companyMobile: ['0712345678'], 
            items: ['Brake Pads']
        };

        const validationResult = validateSupplier(validSupplier);
        expect(validationResult.error).toBeUndefined();        
    }); 

    // TEST CASE 2: Testing what happens if Company Name is missing
    it('should fail if the supplier company name is missing', () => {

        const invalidSupplier = {
            agentName: 'Kamal',
            companyMobile: ['0712345678'],
        };

        const validationResult = validateSupplier(invalidSupplier);
        expect(validationResult.error).toBeDefined();
        expect(validationResult.error.details[0].message).toBe('Company name is required');
    });

    // TEST CASE 3: Testing what happens if the mobile number is too short
    it('should fail if supplier mobile number is not 10 digits', () => {
        
        const invalidSupplier = {
            companyName: 'Toyota Parts',
            companyMobile: ['071234567'] 
        };

        const validationResult = validateSupplier(invalidSupplier);
        expect(validationResult.error).toBeDefined();
        expect(validationResult.error.details[0].message).toBe('Mobile number must be exactly 10 digits');
    });
});