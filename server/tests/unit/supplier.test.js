const { validatedCreateSupplier } = require('../../validation/supplier.validation');

describe('Supplier Validation Logic', () => {
  
  it('should return error if Company Name is missing', () => {
    const reqBody = { companyMobile: ['0771234567'] }; 

    const { error } = validatedCreateSupplier(reqBody);

    expect(error).toBeDefined();
    expect(error.details[0].message).toContain("Company name is required");
  });

  it('should pass if all data is correct', () => {
    const reqBody = { companyName: 'AMW Parts', companyMobile: ['0771234567'] };

    const { error } = validatedCreateSupplier(reqBody);

    expect(error).toBeUndefined();
  });

});