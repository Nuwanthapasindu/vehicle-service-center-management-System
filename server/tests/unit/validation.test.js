const {
  validatedCreateService,
  validatedUpdateService,
  validatedQueryServices,
} = require("../../validation/service.validation");
const {
  validatedQueryPackages,
} = require("../../validation/package.validation");

describe("Service Validation Unit Tests", () => {
  describe("createService Validation", () => {
    test("should pass with valid data", () => {
      const validData = {
        name: "Full Service",
        description: "Comprehensive vehicle inspection and maintenance",
        prices: [
          { model: "CAR", price: 5000 },
          { model: "VAN", price: 6000 },
        ],
      };
      const { value, error } = validatedCreateService(validData);
      expect(error).toBeUndefined();
      expect(value.name).toBe("Full Service");
    });

    test("should fail if name is missing", () => {
      const invalidData = {
        prices: [{ model: "CAR", price: 5000 }],
      };
      const { error } = validatedCreateService(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe("Service name is required");
    });

    test("should fail if name is too short", () => {
      const invalidData = {
        name: "s",
        prices: [{ model: "CAR", price: 5000 }],
      };
      const { error } = validatedCreateService(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe("Service name must be at least 2 characters long");
    });

    test("should fail if prices array is empty", () => {
      const invalidData = {
        name: "Full Service",
        prices: [],
      };
      const { error } = validatedCreateService(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe("At least one price entry is required");
    });

    test("should fail if vehicle model is invalid", () => {
      const invalidData = {
        name: "Full Service",
        prices: [{ model: "BIKE", price: 1000 }],
      };
      const { error } = validatedCreateService(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/Vehicle model must be one of/);
    });
  });

  describe("queryServices Validation", () => {
    test("should fail if maxPrice is less than minPrice", () => {
      const invalidQuery = {
        minPrice: 500,
        maxPrice: 300,
      };
      const { error } = validatedQueryServices(invalidQuery);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe("Minimum price must be less than maximum price");
    });

    test("should pass with valid pagination", () => {
      const validQuery = {
        page: 2,
        limit: 20,
      };
      const { value, error } = validatedQueryServices(validQuery);
      expect(error).toBeUndefined();
      expect(value.page).toBe(2);
      expect(value.limit).toBe(20);
    });
  });

  describe("queryPackages Validation", () => {
    test("should fail if maxPrice is less than minPrice", () => {
      const invalidQuery = {
        minPrice: 500,
        maxPrice: 300,
      };
      const { error } = validatedQueryPackages(invalidQuery);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe("Minimum price must be less than maximum price");
    });

    test("should pass and coerce string parameters to correct types", () => {
      const queryParams = {
        page: "3",
        limit: "15",
        all: "false",
      };
      const { value, error } = validatedQueryPackages(queryParams);
      expect(error).toBeUndefined();
      expect(value.page).toBe(3);
      expect(value.limit).toBe(15);
      expect(value.all).toBe(false);
    });

    test("should coerce all='true' to boolean true", () => {
      const queryParams = {
        all: "true",
      };
      const { value, error } = validatedQueryPackages(queryParams);
      expect(error).toBeUndefined();
      expect(value.all).toBe(true);
    });
  });
});
