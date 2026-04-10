const Invoice = require("../model/Invoice");
const JobCard = require("../model/JobCard");
const User = require("../model/User");
const Package = require("../model/Package");
const AppError = require("../error/AppError");
const { validatedCreateInvoice } = require("../validation/invoice.validation");
const { default: mongoose } = require("mongoose");

/**
 * Create a new invoice tied seamlessly to either a JobCard or a Walk-in Customer.
 * Validation strictly restricts allowing both JobCard and Customer concurrently.
 * Calculates references securely, throwing errors if any ObjectID lookup fails.
 *
 * @param {Object} payload - The request body payload from the client
 * @returns {Promise<string>} - Success message confirming creation
 * @throws {AppError} - Throws standard error codes like 400 for structural invalidity, 404 for missing entities, or 409 for conflicts.
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
/**
 * Fetches all non-deleted invoices within the database.
 * Allows optional boolean filtering natively through `queryOptions`,
 * and strictly populates relationship references to reduce client-side lookups.
 *
 * @param {Object} queryOptions - Extracted from `req.query` (e.g., isCompleted toggle)
 * @returns {Promise<Array>} - Mongoose object array containing all matched invoices
 * @throws {AppError} - Throws 500 automatically if document fetch operations crash.
 */
exports.getAllInvoices = async (queryOptions = {}) => {
  try {
    const filter = { isDeleted: false };

    // Apply isCompleted filter if provided in query
    if (queryOptions.isCompleted !== undefined) {
      filter.isCompleted =
        queryOptions.isCompleted === "true" ||
        queryOptions.isCompleted === true;
    }

    const invoices = await Invoice.find(filter)
      .populate([
        {
          path: "customer",
          select: ["name", "mobile"],
        },
        {
          path: "jobCard",
          select: ["booking", "-_id"],
          populate: {
            path: "booking",
            select: ["vehicle", "-_id"],
            populate: {
              path: "vehicle",
              select: ["licensePlate", "-_id"],
            },
          },
        },
      ])
      .select([
        "-__v",
        "-isDeleted",
        "-deletedAt",
        "-id",
        "-selectedPackage.package",
        "-additionalItems.item",
        "-additionalServices.service",
      ])
      .sort({ createdAt: -1 });

    return invoices;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to fetch invoices", 500);
  }
};

/**
 * Fetch a single invoice by its Object ID securely.
 *
 * @param {string} invoiceId - MongoDB Object ID of the invoice
 * @returns {Promise<Object>} - The invoice object
 * @throws {AppError} - Throws 400 for invalid ID, 404 for not found
 */
exports.getInvoiceById = async (invoiceId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw new AppError("Invalid invoice ID provided", 400);
    }

    const invoice = await Invoice.findOne({ _id: invoiceId, isDeleted: false })
      .populate([
        {
          path: "customer",
          select: ["name", "mobile", "email"],
        },
        {
          path: "jobCard",
          select: ["status", "booking", "milageCount", "-_id"],
          populate: {
            path: "booking",
            select: ["vehicle", "-_id"],
            populate: {
              path: "vehicle",
              select: [
                "-_id",
                "-createdAt",
                "-updatedAt",
                "-isDeleted",
                "-deletedAt",
                "-__v",
              ],
              populate: {
                path: "image",
                select:["filePath","-_id"]
              },
            },
          },
        },
        {
          path: "selectedPackage.package",
          select: ["name", "description", "-_id"],
        },
        {
          path: "additionalItems.item",
          select: [
            "-_id",
            "-__v",
            "-createdAt",
            "-updatedAt",
            "-isDeleted",
            "-deletedAt",
          ],
        },
        {
          path: "additionalServices.service",
          select: [
            "-_id",
            "-__v",
            "-createdAt",
            "-updatedAt",
            "-isDeleted",
            "-deletedAt",
          ],
        },
      ])
      .select(["-__v", "-isDeleted", "-deletedAt", "-id"]);

    if (!invoice) {
      throw new AppError("Invoice not found", 404);
    }

    return invoice;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to fetch the invoice", 500);
  }
};
