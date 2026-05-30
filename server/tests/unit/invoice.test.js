const { createInvoice, getInvoiceById, addInvoiceItem, completeInvoice } = require("../../controller/invoice.controller");
const Invoice = require("../../model/Invoice");
const JobCard = require("../../model/JobCard");
const User = require("../../model/User");
const Package = require("../../model/Package");
const Inventory = require("../../model/Inventory");
const Service = require("../../model/Service");

jest.mock("../../model/Invoice");
jest.mock("../../model/JobCard");
jest.mock("../../model/User");
jest.mock("../../model/Package");
jest.mock("../../model/Inventory");
jest.mock("../../model/Service");
jest.mock("../../controller/inventory.controller", () => ({
  reduceStockByInvoice: jest.fn(),
  increaseStockByPO: jest.fn(),
}));
jest.mock("../../validation/invoice.validation", () => ({
  validatedCreateInvoice: jest.fn(),
  validatedAddInvoiceItem: jest.fn(),
  validatedRemoveInvoiceItem: jest.fn(),
}));

describe("Invoice Controller Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createInvoice", () => {
    it("should throw error on invalid customer id", async () => {
      const { validatedCreateInvoice } = require("../../validation/invoice.validation");
      validatedCreateInvoice.mockReturnValue({ value: { customer: "invalid" }, error: null });

      await expect(createInvoice({})).rejects.toThrow("Invalid customer id");
    });

    it("should create invoice with valid customer", async () => {
      const { validatedCreateInvoice } = require("../../validation/invoice.validation");
      validatedCreateInvoice.mockReturnValue({ value: { customer: "507f1f77bcf86cd799439011" }, error: null });
      
      User.findOne.mockResolvedValue({ _id: "507f1f77bcf86cd799439011" });
      Invoice.prototype.save = jest.fn().mockResolvedValue({});

      const result = await createInvoice({});
      expect(result.message).toContain("created successfully");
    });
  });

  describe("completeInvoice", () => {
    it("should complete invoice successfully", async () => {
      Invoice.findOne.mockResolvedValue({ _id: "1", isCompleted: false, additionalItems: [], save: jest.fn() });

      const result = await completeInvoice("507f1f77bcf86cd799439011", {});
      expect(result).toContain("completed successfully");
    });

    it("should throw error if already completed", async () => {
      Invoice.findOne.mockResolvedValue({ _id: "1", isCompleted: true });

      await expect(completeInvoice("507f1f77bcf86cd799439011", {}))
        .rejects.toThrow("already completed");
    });
  });

  describe("addInvoiceItem", () => {
    it("should successfully add a new additional service item", async () => {
      const { validatedAddInvoiceItem } = require("../../validation/invoice.validation");
      const serviceId = "507f1f77bcf86cd799439012";
      validatedAddInvoiceItem.mockReturnValue({
        value: {
          type: "SERVICE",
          data: {
            service: serviceId,
            charge: 1500,
          },
        },
        error: null,
      });

      const mockSave = jest.fn();
      const mockInvoice = {
        _id: "507f1f77bcf86cd799439011",
        invoiceId: "INV-001",
        isCompleted: false,
        additionalServices: [],
        save: mockSave,
      };

      Invoice.findOne.mockResolvedValue(mockInvoice);
      Service.findOne.mockResolvedValue({ _id: serviceId, isDeleted: false });

      const result = await addInvoiceItem("507f1f77bcf86cd799439011", {
        type: "SERVICE",
        data: { service: serviceId, charge: 1500 },
      });

      expect(mockInvoice.additionalServices.length).toBe(1);
      expect(mockInvoice.additionalServices[0].service).toBe(serviceId);
      expect(mockInvoice.additionalServices[0].charge).toBe(1500);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toContain("updated successfully");
    });

    it("should update the charge of an existing additional service item", async () => {
      const { validatedAddInvoiceItem } = require("../../validation/invoice.validation");
      const serviceId = "507f1f77bcf86cd799439012";
      validatedAddInvoiceItem.mockReturnValue({
        value: {
          type: "SERVICE",
          data: {
            service: serviceId,
            charge: 2500, // Updated price
          },
        },
        error: null,
      });

      const mockSave = jest.fn();
      const mockInvoice = {
        _id: "507f1f77bcf86cd799439011",
        invoiceId: "INV-001",
        isCompleted: false,
        additionalServices: [
          {
            service: serviceId,
            charge: 1500, // original price
          },
        ],
        save: mockSave,
      };

      Invoice.findOne.mockResolvedValue(mockInvoice);
      Service.findOne.mockResolvedValue({ _id: serviceId, isDeleted: false });

      const result = await addInvoiceItem("507f1f77bcf86cd799439011", {
        type: "SERVICE",
        data: { service: serviceId, charge: 2500 },
      });

      expect(mockInvoice.additionalServices.length).toBe(1);
      expect(mockInvoice.additionalServices[0].charge).toBe(2500);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toContain("updated successfully");
    });
  });
});
