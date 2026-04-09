const Invoice = require("../model/Invoice");
const JobCard = require("../model/JobCard");
const User = require("../model/User");
const Package = require("../model/Package");
const AppError = require("../error/AppError");
const { validatedCreateInvoice } = require("../validation/invoice.validation");
const { default: mongoose } = require("mongoose");

/**
 *
 * @param {Object} payload
 * @returns {Promise<string>}
 */
exports.createInvoice = async (payload) => {
  try {
    const saveData = {};
    // Validate request body
    const { error, value } = validatedCreateInvoice(payload);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }
    // Process Customer conditionally
    if (value.customer) {
      if (!mongoose.Types.ObjectId.isValid(value.customer)) {
        throw new AppError("Invalid customer id", 400);
      }
      const customerExists = await User.findOne({
        _id: value.customer,
        isDeleted: false,
      });
      if (!customerExists) {
        throw new AppError("Customer not found", 404);
      }
      saveData.customer = customerExists._id;
    }

    // Process JobCard conditionally
    if (value.jobCard) {
      if (!mongoose.Types.ObjectId.isValid(value.jobCard)) {
        throw new AppError("Invalid job card id", 400);
      }
      const jobCardExists = await JobCard.findOne({
        _id: value.jobCard,
        isDeleted: false,
      }).populate({
        path: "booking",
        populate: {
          path: "customer",
          select: "_id",
        },
      });
      if (!jobCardExists) {
        throw new AppError("JobCard not found", 404);
      }

      // Check if an invoice already exists for this JobCard
      const existingInvoice = await Invoice.findOne({
        jobCard: value.jobCard,
        isDeleted: false,
      });
      if (existingInvoice) {
        throw new AppError("An invoice already exists for this JobCard", 409);
      }
      saveData.jobCard = jobCardExists._id;
      saveData.customer = jobCardExists.booking.customer._id;
    }

    // Verify referenced Package strictly
    if (value.selectedPackage && value.selectedPackage.package) {
      if (!mongoose.Types.ObjectId.isValid(value.selectedPackage.package)) {
        throw new AppError("Invalid package id", 400);
      }
      const packageExists = await Package.findOne({
        _id: value.selectedPackage.package,
        isDeleted: false,
      });
      if (!packageExists) {
        throw new AppError("Selected package not found", 404);
      }
    }

    const newInvoice = new Invoice({
      ...saveData,
      selectedPackage: value.selectedPackage,
    });
    await newInvoice.save();
    return `${newInvoice?.invoiceId || "Invoice"} created successfully`;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create invoice", 500);
  }
};
