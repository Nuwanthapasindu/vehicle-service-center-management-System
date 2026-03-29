//mpn test
const { validateSupplier } = require('../validation/supplier.validation');

describe('Supplier Validation Logic', () => {
  
  it('should return 400 Error if Company Name is missing', () => {
    const req = { body: { companyMobile: ['0771234567'] } }; 
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    validateSupplier(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Company Name is required." });
  });

  it('should pass and call next() if all data is correct', () => {
    const req = { body: { companyName: 'AMW Parts', companyMobile: ['0771234567'] } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    validateSupplier(req, res, next);

    expect(next).toHaveBeenCalled();
  });

});